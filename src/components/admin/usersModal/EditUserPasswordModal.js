import { putUserPassword } from "../../../network/lib/user";
import { Button, Modal, Form } from "react-bootstrap"
import { QuickModal } from "../../common/QuickModal"
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function EditUserPasswordModal({show, setShow, dataSubmitted, user })
{
    const [formData, setFormData] = useState({
        id: user.id,
        password: '',
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
    const [errorsMessages2,setErrorsMessages2] = useState();
      const queryClient2 = useQueryClient();
      const { mutate: mutateEditUserPasswd } = useMutation(putUserPassword, {
        onError: (error) => {setErrorsMessages2(error.response?.data.errors)
          setModalStatement({color: "text-danger",message: "Error in Editing User Password!"});
        },/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/
        onSettled: () => {
            queryClient2.invalidateQueries(['users']);

        },
        onSuccess: () => {
          setModalStatement({color: "text-success",message: "User Password Edited!"});
          //setShow(false);
        }
    })
      const handleSubmitEdit2 = (e) => {
        e.preventDefault();
        mutateEditUserPasswd({ id: user.id, data: {password: formData.password} });

        //dataSubmitted(formData)
      };

    return(
        <QuickModal className="modal-dialog-scrollable modal-dialog-centered" show={show} setShow={setShow}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Password</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit2}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Password</Form.Label>
              <div className="text-danger fw-normal  rounded p-1 ">{errorsMessages2?.password}</div>
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
          <Button className="text-white" variant="success" onClick={handleSubmitEdit2}>
            Change
          </Button>
        </Modal.Footer>
      </QuickModal>
    )
}