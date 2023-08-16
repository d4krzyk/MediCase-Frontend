import { Button, Modal, Form } from "react-bootstrap"
import { QuickModal } from "../../common/QuickModal"
import { useState } from "react";
import { postUser } from "../../../network/lib/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function AddUserModal({ show, setShow, dataSubmitted}) {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
      });



      const [errorsMessages,setErrorsMessages] = useState();
      const [ModalStatement, setModalStatement] = useState();


      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
      const queryClient = useQueryClient();
      const { mutate: mutateAddUser } = useMutation(postUser, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors);
            setModalStatement({color: "text-danger",message: "Error in Adding User!"});
        },
        onSettled: () => {
            queryClient.invalidateQueries(['users']);


        },
        onSuccess: () => {
            //setModalStatement({color: "text-success",message: "User Added!"});
            setShow(false);
        }
    })


      const handleSubmitAdd = (e) => {
        e.preventDefault();
        mutateAddUser({firstName: formData.firstName ,lastName: formData.lastName ,
          email: formData.email, password: formData.password})
        //dataSubmitted(formData)
        
      };

    return (
        <QuickModal className="modal-dialog-centered modal-dialog-scrollable" show={show} setShow={setShow}>
            <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label className="fw-bold">Email</Form.Label>
                        <div className="text-danger fw-normal  rounded p-1 ">{errorsMessages?.Email}</div>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">First Name </Form.Label>
                        <div className="text-danger fw-normal  rounded p-1 ">{errorsMessages?.FirstName}</div>

                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Last Name </Form.Label>
                        <div className="text-danger fw-normal rounded p-1 ">{errorsMessages?.LastName}</div>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Password </Form.Label>
                        <div className="text-danger fw-normal rounded p-1 ">{errorsMessages?.Password}</div>
                        <Form.Control
                            type="text"
                            name="password"
                            value={formData.password}
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
                <Button className="text-white" variant="success" onClick={handleSubmitAdd}>
                    Add
                </Button>

            </Modal.Footer>
        </QuickModal>
    )
}