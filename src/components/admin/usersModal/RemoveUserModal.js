
import { Button, Modal, Form } from "react-bootstrap"
import { QuickModal } from "../../common/QuickModal"
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../../network/lib/user";

export function RemoveUserModal({show, setShow, setActiveIndex, user })
{
    const [formData, setFormData] = useState({

        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      const [ModalStatement, setModalStatement] = useState();
      const [errorsMessages,setErrorsMessages] = useState();
      const queryClient = useQueryClient();
      const { mutate: mutateRemoveUser } = useMutation(deleteUser, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors)
          setModalStatement({color: "text-danger",message: "Error in Adding User!"});},
        onSettled: () => {
            queryClient.invalidateQueries(['users']);
        },
        onSuccess: () => {
          setModalStatement({color: "text-success",message: "User Removed!"});
          setActiveIndex(-1);
          setShow(false);
        }
    })
    const handleSubmitRemove = (e) => {
      e.preventDefault();
      mutateRemoveUser(user.id);
      //dataSubmitted(formData)
    };


      useEffect (()=> {
        setFormData(user);
      },[user]);


    return(
        <QuickModal className="modal-dialog-scrollable modal-dialog-centered" show={show} setShow={setShow}>
        <Modal.Header closeButton>
          <Modal.Title>Remove User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmitRemove}>
            <Form.Group className="mb-3">
              <div className="fw-normal">Are you sure you want to delete the <mark className="p-1 text-white bg-background rounded fw-bold">{formData.firstName}  {formData.lastName}</mark>?</div>
              <div className="text-danger fw-normal  rounded p-1 ">{errorsMessages?.id}</div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className={` ${ModalStatement?.color} fw-semibold  rounded p-1 `}>{ModalStatement?.message}</div>
          <Button className="text-white" variant="primary" onClick={() => setShow(false)}>
            No
          </Button>
          <Button className="text-white" variant="danger" type="submit" onClick={handleSubmitRemove}>
            Yes
          </Button>
        </Modal.Footer>
      </QuickModal>
    )
}