import { putUserName } from "../../../network/lib/user";
import { Button, Modal, Form } from "react-bootstrap"
import { QuickModal } from "../../common/QuickModal"
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function EditUserNameModal({show, setShow, dataSubmitted, user })
{
    const [formData, setFormData] = useState({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      useEffect (()=> {
        setFormData(user);
      },[user]);

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
      const [ModalStatement, setModalStatement] = useState();
      const [errorsMessages,setErrorsMessages] = useState();
      const queryClient = useQueryClient();
      const { mutate: mutateEditUserName } = useMutation(putUserName, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors);
          setModalStatement({color: "text-danger",message: "Error in Editing User Name!"});}/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/,
        onSettled: () => {
            queryClient.invalidateQueries(['users']);

        },
        onSuccess: () => {
          setModalStatement({color: "text-success",message: "User Name Edited!"});
          //setShow(false);
        }
    })
    


      const handleSubmitEdit = (e) => {
        e.preventDefault();
        mutateEditUserName({ id: user.id, data: {firstName: formData.firstName ,lastName: formData.lastName} });
        //dataSubmitted(formData)
      };

    return(
        <QuickModal className="modal-dialog-scrollable modal-dialog-centered" show={show} setShow={setShow}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">First Name</Form.Label>
              <div className="text-danger fw-normal  rounded p-1 ">{errorsMessages?.firstName}</div>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Last Name</Form.Label>
              <div className="text-danger fw-normal  rounded p-1 ">{errorsMessages?.lastName}</div>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <div className={` ${ModalStatement?.color} fw-semibold  rounded p-1 `}>{ModalStatement?.message}</div>
          <Button className="text-white" variant="primary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button className="text-white" variant="success" type="submit" onClick={handleSubmitEdit}>
            Change
          </Button>
        </Modal.Footer>

      </QuickModal>
    )
}