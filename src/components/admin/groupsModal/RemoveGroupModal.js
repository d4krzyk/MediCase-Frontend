
import { Button, Modal, Form } from "react-bootstrap"
import { QuickModal } from "../../common/QuickModal"
import { useState/*, useEffect*/ } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "../../../network/lib/group";

export function RemoveGroupModal({show, setShow, setActiveIndexGroup, group })
{
    //const [formData, setFormData] = useState({name: group.name});
    const [ModalStatement, setModalStatement] = useState();

      const [errorsMessages,setErrorsMessages] = useState();
      const queryClient = useQueryClient();
      const { mutate: mutateRemoveUser } = useMutation(deleteGroup, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors)
        setModalStatement({color: "text-danger",message: "Error in Removing Group!"})},
        onSettled: () => {
            queryClient.invalidateQueries(['groups']);

        },
        onSuccess: () => {
          setModalStatement({color: "text-success",message: "Group Removed!"});
          setActiveIndexGroup(-1);
          setShow(false);
        }
    })
    const handleSubmitRemove = (e) => {
      e.preventDefault();
      mutateRemoveUser(group.id);
      //dataSubmitted(formData)
    };


      //useEffect (()=> {
      //  setFormData(group);
      //},[group]);


    return(
        <QuickModal className="modal-dialog-scrollable modal-dialog-centered" show={show} setShow={setShow}>
        <Modal.Header closeButton>
          <Modal.Title>Remove User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmitRemove}>
            <Form.Group className="mb-3">
              <div className="fw-normal">Are you sure you want to delete the <mark className="p-1 text-white bg-background rounded fw-bold">{group.name}</mark>?</div>
              <div className="text-danger fw-normal  rounded p-1 ">{errorsMessages?.id}</div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className={` ${ModalStatement?.color} fw-semibold  rounded p-1 `}>{ModalStatement?.message}</div>
          <Button className="text-white" variant="primary" onClick={() => setShow(false)}>
            No
          </Button>
          <Button className="text-white" variant="danger" onClick={handleSubmitRemove}>
            Yes
          </Button>
        </Modal.Footer>
      </QuickModal>
    )
}