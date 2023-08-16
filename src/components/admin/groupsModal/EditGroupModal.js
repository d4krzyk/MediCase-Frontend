//import { putUser } from "../../../network/lib/user";
import { Button, Modal, Form } from "react-bootstrap"
import { QuickModal } from "../../common/QuickModal"
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "../BoardAdmin.module.css";
import { putGroupDescription, putGroupExpirationDate, putGroupName, putGroupRoles } from "../../../network/lib/group";

export function EditGroupModal({show, setShow, dataSubmitted, group })
{
  const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        name: group.name,
        description: group.description,
        expirationDate: group.expirationDate,
        isUser: group.isUser,
        isModerator: group.isModerator,
        isAdmin: group.isAdmin,
      });
      const [successMessage, setSuccessMessage] = useState();
      const [ModalStatementName, setModalStatementName] = useState();
      const [ModalStatementDescription, setModalStatementDescription] = useState();
      const [ModalStatementExpirationDate, setModalStatementExpirationDate] = useState();
      const [ModalStatementRoles, setModalStatementRoles] = useState();
      const [errorsMessages,setErrorsMessages] = useState();
      useEffect (()=> {
        setFormData(group);
      },[group,ModalStatementName,ModalStatementDescription,ModalStatementExpirationDate,ModalStatementRoles,errorsMessages]);

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

      const queryClient = useQueryClient();
      const { mutate: mutateEditGroupName } = useMutation(putGroupName, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors)

          setModalStatementName({color: "text-danger",message: "Error in Editing Group Name!"});},/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/
        onSettled: () => {
            queryClient.invalidateQueries(['groups']);

        },
        onSuccess: () => {
          setErrorsMessages('');
          setSuccessMessage('Name edited!');
          setModalStatementName({color: "text-success",message: ""});
        }
    })
      const { mutate: mutateEditGroupDescription } = useMutation(putGroupDescription, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors)

          setModalStatementDescription({color: "text-danger",message: "Error in Editing Group Description!"});},/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/
        onSettled: () => {
            queryClient.invalidateQueries(['groups']);

        },
        onSuccess: () => {
          setErrorsMessages('');
          setSuccessMessage('Description edited!');
          setModalStatementDescription({color: "text-success",message: ""});
          //setShow(false);
        }
    })
      const { mutate: mutateEditGroupExpirationDate } = useMutation(putGroupExpirationDate, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors)

          setModalStatementExpirationDate({color: "text-danger",message: "Error in Editing Group Expiration Date!"});},/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/
        onSettled: () => {
            queryClient.invalidateQueries(['groups']);

        },
        onSuccess: () => {
          setErrorsMessages('');
          setSuccessMessage('Expiration Date edited!');
          setModalStatementExpirationDate({color: "text-success",message: ""});
          //setShow(false);
        }
    })
      const { mutate: mutateEditGroupRoles } = useMutation(putGroupRoles, {
        onError: (error) => {setErrorsMessages(error.response?.data.errors)

          setModalStatementRoles({color: "text-danger",message: "Error in Editing Group Roles!"});},/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/
        onSettled: () => {
            queryClient.invalidateQueries(['groups']);

        },
        onSuccess: () => {
          setErrorsMessages('');
          setSuccessMessage('Roles edited!');
          setModalStatementRoles({color: "text-success",message: ""});
          //setShow(false);
        }
    })


      const handleSubmitName = (e) => {
        e.preventDefault();
        setSuccessMessage('');
        mutateEditGroupName({ id: group.id, data: { name: formData.name } });

      };
      const handleSubmitDescription = (e) => {
        e.preventDefault();
        setSuccessMessage('');
        mutateEditGroupDescription({ id: group.id, data: { description: formData.description} });

      };
      const handleSubmitExpirationDate = (e) => {
        e.preventDefault();
        setSuccessMessage('');
        mutateEditGroupExpirationDate({id: group.id,data: {expirationDate: formData.expirationDate,}});

      };
      const handleSubmitRoles = (e) => {
        e.preventDefault();
        setSuccessMessage('');
         
        mutateEditGroupRoles({ id: group.id, data: { isAdmin: formData.isAdmin, isModerator: formData.isModerator, isUser: formData.isUser } });
      };
    return (
		<QuickModal className='modal-dialog-scrollable modal-dialog-centered' show={show} setShow={setShow}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Group</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form >
					<Form.Group className='mb-3'>
						<Form.Label className='fw-bold'>Name</Form.Label>
						<div className='text-danger fw-normal  rounded p-1 '>{errorsMessages?.Name}</div>
						<div className='d-flex'>
							<Form.Control className='' type='text' name='name' value={formData.name} onChange={handleChange} />
							<Button className='text-white ms-2' variant='success' onClick={handleSubmitName}>
								Save
							</Button>
						</div>
            <div className={` ${ModalStatementName?.color} fw-semibold  rounded p-1 `}>{ModalStatementName?.message}</div>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label className='fw-bold'>Description</Form.Label>
						<div className='text-danger fw-normal  rounded p-1 '>{errorsMessages?.Description}</div>
						<div className='d-flex'>
							<Form.Control type='text' name='description' value={formData.description} onChange={handleChange} />
							<Button className='text-white ms-2' variant='success' onClick={handleSubmitDescription}>
								Save
							</Button>
						</div>
            <div className={` ${ModalStatementDescription?.color} fw-semibold  rounded p-1 `}>{ModalStatementDescription?.message}</div>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label className='fw-bold'>Expiration Date</Form.Label>
						<div className='text-danger fw-normal rounded p-1 '>{errorsMessages?.expirationDate}</div>
						<div className='d-flex'>
							<Form.Control
								type='date'
								name='expirationDate'
								placeholder='dd-mm-yyyy'
								value={formData.expirationDate === null ? '' : formData.expirationDate}
								onChange={handleChange}
								min={today}
							/>
							<Button className='text-white ms-2' variant='success' onClick={handleSubmitExpirationDate}>
								Save
							</Button>
						</div>
            <div className={` ${ModalStatementExpirationDate?.color} fw-semibold  rounded p-1 `}>{ModalStatementExpirationDate?.message}</div>
					</Form.Group>
					<Form.Group className='mb-1'>
						<Form.Label className='fw-bold'>Roles</Form.Label>
						<div className='p-1 rounded checkbox-form'>
							<div className={`form-check ${styles.form_check}`}>
								<input
									className={`form-check-input ${styles.form_check_input} `}
									type='checkbox'
									defaultChecked={formData.isUser}
									value={formData.isUser}
									onClick={() => {
										setFormData({ ...formData, isUser: !formData.isUser });
									}}
									id='flexCheckDefault-1'
								/>
								<label className=' m-0 form-check-label'>User</label>
							</div>
						</div>
            
						<div className='p-1 rounded checkbox-form'>
							<div className={`form-check ${styles.form_check}`}>
								<input
									className={`form-check-input ${styles.form_check_input} `}
									type='checkbox'
									defaultChecked={formData.isModerator}
									value={formData.isModerator}
									onClick={() => {
										setFormData({ ...formData, isModerator: !formData.isModerator });
									}}
									id='flexCheckDefault-1'
								/>
								<label className=' m-0 form-check-label'>Moderator</label>
							</div>
						</div>
						<div className='p-1 rounded checkbox-form'>
							<div className={`form-check ${styles.form_check}`}>
								<input
									className={`form-check-input ${styles.form_check_input}`}
									type='checkbox'
									defaultChecked={formData.isAdmin}
									value={formData.isAdmin}
									onClick={() => {
										setFormData({...formData,isAdmin: !formData.isAdmin})
									}}
								/>
								<label className=' m-0 form-check-label'>Admin</label>
							</div>
						</div>
            <div className='d-flex justify-content-end'>
              <div className={` ${ModalStatementRoles?.color} fw-semibold  rounded p-1 `}>{ModalStatementRoles?.message}</div>
							<Button className='text-white ms-2' variant='success' onClick={handleSubmitRoles}>
								Save
							</Button>
						</div>
					</Form.Group>
				</Form>
			</Modal.Body>
      <Modal.Footer>
        <div className={` text-success fw-semibold rounded p-1 `}>{successMessage}</div>
        </Modal.Footer>
		</QuickModal>
	);
}