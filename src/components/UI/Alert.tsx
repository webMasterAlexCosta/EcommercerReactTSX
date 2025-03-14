import { useEffect } from "react";
import Swal from "sweetalert2";

interface AlertProps {
  title: string;
  text: string;
  icon: "success" | "error" | "warning" | "info" | "question";
  onClose?: () => void;
}

const Alert = ({ title, text, icon, onClose }: AlertProps) => {
  useEffect(() => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "Fechar",
    }).then(() => {
      if (onClose) onClose(); 
    });
  }, [title, text, icon, onClose]);

  return null;
};

export default Alert;
