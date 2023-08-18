import { Button, Modal, Form } from "react-bootstrap"
import { QuickModal } from "../../common/QuickModal"
import { useState, useEffect } from "react";
import { postGroup } from "../../../network/lib/group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "../BoardAdmin.module.css";

export function AddGroupModal({ show, setShow, dataSubmitted}) {

    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        expirationDate: today,
        IsUser: false,
        IsModerator: false,
        IsAdmin: false,
      });
      const [ModalStatement, setModalStatement] = useState();
      useEffect (()=> {
        setFormData((oldformData)=>({...oldformData,expirationDate: today}));
      },[show,today]);
      const [errorsMessages,setErrorsMessages] = useState();

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
      const queryClient = useQueryClient();
      const { mutate: mutateAddGroup } = useMutation(postGroup, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors);
          setModalStatement({color: "text-danger",message: "Error in Adding Group!"});}/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/,
        onSettled: () => {
            queryClient.invalidateQueries(['groups']);

        },
        onSuccess: () => {
          setModalStatement({color: "text-success",message: "Group Added!"});
          //setShow(false);
        }
    })


      const handleSubmitAdd = (e) => {
        e.preventDefault();

        mutateAddGroup({name: formData.name ,description: formData.description ,
        expirationDate: formData.expirationDate, isAdmin: formData.IsAdmin, isModerator: formData.IsModerator, isUser: formData.IsUser});

        //dataSubmitted(formData)
        
      };

      //const parts = formData.expirationDate.split("-");
      //const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    return (
      <QuickModal
        className="modal-dialog-centered modal-dialog-scrollable"
        show={show}
        setShow={setShow}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Group</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label className="fw-bold">Name</Form.Label>
              <div className="text-danger fw-normal  rounded p-1 ">
                {errorsMessages?.name}
              </div>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <div className="text-danger fw-normal  rounded p-1 ">
                {errorsMessages?.description}
              </div>

              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Expiration Date</Form.Label>
              <div className="text-danger fw-normal rounded p-1 ">
                {errorsMessages?.expirationDate}
              </div>
              <Form.Control
                type="date"
                name="expirationDate"
                placeholder="dd-mm-yyyy"
                value={formData.expirationDate}
                onChange={handleChange}
                min={today}
              />
            </Form.Group>

            <Form.Group className="mb-1">
              <Form.Label className="fw-bold">Roles</Form.Label>
              <div className="p-1 rounded checkbox-form">
                <div className={`form-check ${styles.form_check}`}>
                  <input
                    className={`form-check-input ${styles.form_check_input} `}
                    type="checkbox"
                    value={formData.IsUser}
                    onClick={()=> {setFormData({...formData,IsUser: !formData.IsUser})}}
                    id="flexCheckDefault-1"
                  />
                  <label
                    className=" m-0 form-check-label"
                    htmlFor="flexCheckDefault-1"
                  >
                    User
                  </label>
                </div>
              </div>
              <div className="p-1 rounded checkbox-form">
                <div className={`form-check ${styles.form_check}`}>
                  <input
                    className={`form-check-input ${styles.form_check_input} `}
                    type="checkbox"
                    value={formData.IsModerator}
                    onClick={()=> {setFormData({...formData,IsModerator: !formData.IsModerator})}}
                    id="flexCheckDefault-1"
                  />
                  <label
                    className=" m-0 form-check-label"
                    htmlFor="flexCheckDefault-1"
                  >
                    Moderator
                  </label>
                </div>
              </div>
              <div className="p-1 rounded checkbox-form">
                <div className={`form-check ${styles.form_check}`}>
                  <input
                    className={`form-check-input ${styles.form_check_input}`}
                    type="checkbox"
                    value={formData.IsAdmin}
                    onClick={()=> {setFormData({...formData,IsAdmin: !formData.IsAdmin})}}
                    id="flexCheckDefault-1"
                  />
                  <label
                    className=" m-0 form-check-label"
                    htmlFor="flexCheckDefault-1"
                  >
                    Admin
                  </label>
                </div>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <div className={` ${ModalStatement?.color} fw-semibold  rounded p-1 `}>{ModalStatement?.message}</div>
          <Button
            className="text-white"
            variant="primary"
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
          <Button
            className="text-white"
            variant="success"
            onClick={handleSubmitAdd}
          >
            Add
          </Button>
        </Modal.Footer>
      </QuickModal>
    );
}