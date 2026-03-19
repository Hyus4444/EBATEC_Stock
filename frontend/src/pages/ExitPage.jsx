import { useNavigate } from "react-router-dom";
import { registerExitRequest } from "../api/inventoryMovementsApi";
import MovementForm from "../components/MovementForm";

export default function ExitPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const response = await registerExitRequest(payload);
    alert(`Salida registrada correctamente. Operación: ${response.id_operacion}`);
    navigate("/inventory");
  };

  return (
    <MovementForm
      title="Registrar Salida"
      helperText="Seleccione en la barra el producto a sustraer y añada los campos que sean necesarios"
      onSubmit={handleSubmit}
      submitText="Registrar salida"
      allowedReasons={["DESPACHO", "CONSUMO"]}
    />
  );
}