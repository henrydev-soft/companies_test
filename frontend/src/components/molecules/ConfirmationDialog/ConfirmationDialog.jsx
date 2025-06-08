
import Button from '../../atoms/Button/Button';
import Modal from '../../organisms/Modal/Modal'; 

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;