import { useNavigate } from "react-router-dom";
import { registerEntryRequest } from "../api/inventoryMovementsApi";
import MovementForm from "../components/MovementForm";

export default function EntryPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const response = await registerEntryRequest(payload);
    alert(`Entrada registrada correctamente. Operación: ${response.id_operacion}`);
    navigate("/inventory");
  };

  return (
    <MovementForm
      title="Registrar Entrada"
      helperText="Seleccione en la barra el producto a ingresar y añada los campos que sean necesarios"
      onSubmit={handleSubmit}
      submitText="Registrar entrada"
      allowedReasons={["COMPRA", "REINTEGRO"]}
    />
  );
}