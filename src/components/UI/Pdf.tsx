import { jsPDF } from "jspdf";
import * as QRCode from "qrcode";
import * as carrinhoService from "../../services/CarrinhoService";
import * as authService from "../../services/AuthService";
import { EnderecoDTO } from "../../models/dto/UserDTO";

// Interface para o payload do token
interface PayloadDTO {
    perfis: string[];
    sub: string;
    endereco: EnderecoDTO | null;
    iss: string;
    nome: string;
    exp: number;
    email: string;
}

// Interface para os produtos do carrinho
interface ProdutoCarrinhoPDF {
    nome: string;
    quantidade: number;
    
    preco: number;
}

// ✅ Função exportada para ser chamada ao finalizar o pedido
const gerarPDF=async()=> {
    const payload = authService.getAccessTokenPayload() as PayloadDTO;
    const carrinho = carrinhoService.getCarrinho() || [];
    const cart: ProdutoCarrinhoPDF[] = carrinho.map(item => ({
        nome: item.nome,
        quantidade: item.quantidade,
        
        preco: item.preco
    }));

    if (cart.length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de gerar o PDF.");
        return;
    }

    // Garantia de valores padrão
    const nome: string = payload.nome || "Não especificado";
    const email: string = payload.email || "Não especificado";
    const endereco: EnderecoDTO | null = payload.endereco || null;

    const doc = new jsPDF();
    doc.setFont("Helvetica");

    // Cabeçalho
    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.text("Pedido - Loja Online", 14, 20);

    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text("Data do Pedido:", 14, 30);
    doc.text(new Date().toLocaleDateString(), 60, 30);

    // Informações do Cliente
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Informações do Cliente", 14, 40);
    doc.setFont("Helvetica", "normal");
    doc.text("Nome:", 14, 50);
    doc.text(nome, 60, 50);

    doc.text("E-mail:", 14, 60);
    doc.text(email, 60, 60);

    doc.text("Endereço:", 14, 70);
    const enderecoFormatado = endereco
        ? `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}`
        : "Endereço não disponível";
    doc.text(enderecoFormatado, 60, 70, { maxWidth: 140 });

    doc.text("CEP:", 14, 80);
    doc.text(endereco?.cep || "Não especificado", 60, 80);

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(14, 90, 196, 90);

    // Itens do Pedido
    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.text("Itens do Pedido", 14, 100);

    let yOffset = 110;
    doc.setFont("Helvetica", "normal");

    cart.forEach((item) => {
        const produto = item.nome || "Não especificado";
        const quantidade = item.quantidade || 0;
       
        const preco = item.preco || 0;

        doc.text(produto, 14, yOffset);
        doc.text(String(quantidade), 120, yOffset, { align: "right" });
        doc.text(`R$ ${preco.toFixed(2)}`, 180, yOffset, { align: "right" });

        yOffset += 7;
    });

    // Total do Pedido
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    yOffset += 10;
    const total = cart.reduce((acc, item) => acc + (item.preco || 0) * (item.quantidade || 1), 0);
    doc.text("Total:", 14, yOffset);
    doc.text(`R$ ${total.toFixed(2)}`, 180, yOffset, { align: "right" });

    // QR Code com número do pedido
    try {
        const numeroPedido = Math.floor(Math.random() * 1000000);
        const qrCodeData = `Pedido número: ${numeroPedido}`;
        const qrCodeImage = await gerarQRCode(qrCodeData);
        doc.addImage(qrCodeImage, "PNG", 150, 10, 40, 40);
    } catch (error) {
        console.error("Erro ao gerar QR Code:", error);
    }

    // Salvar PDF
    doc.save("pedido.pdf");
}

// Função para gerar QR Code
function gerarQRCode(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!data) {
            reject("Erro: Dados inválidos para o QR Code.");
            return;
        }
        QRCode.toDataURL(data, { errorCorrectionLevel: "L" }, (err, url) => {
            if (err) reject(err);
            else resolve(url);
        });
    });
}
export {gerarPDF}