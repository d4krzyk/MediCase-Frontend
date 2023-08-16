//import { getUsers, putUser } from "../../../network/lib/user";
import { Modal, Form, Row, Col, Spinner } from "react-bootstrap"
import { TiDelete } from "react-icons/ti";
import { QuickModal } from "../../common/QuickModal"
import {  useEffect, useState } from "react";
//import Select from 'react-select';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//import styles from "../BoardAdmin.module.css";
import { ErrorHandler } from "../../common/ErrorHandler";
import { deleteUserInGroup, getGroup, postUserInGroup } from "../../../network/lib/group";

export function EditUsersInGroupModal({show, setShow, dataSubmitted, group })
{
  const { data: GroupInfo , isLoading, isError, error, refetch: refetchGroups } = useQuery([`group ${group.id}  `,'group'], () => getGroup(group.id,{
    searchPhrase: '',
    pageNumber: 1,
    pageSize: 30,
    sortBy: null,
    sortDirection: 1}))

    const [formData, setFormData] = useState({
      email: '',
    });
    



      useEffect (()=> {
        setFormData(group);
		refetchGroups();

      },[group,refetchGroups]);


      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
      const [ModalStatement, setModalStatement] = useState();
      const [errorsMessages,setErrorsMessages] = useState();
      const queryClient = useQueryClient();
      const { mutate: mutateAddUserInGroup } = useMutation(postUserInGroup, {
        onError: (error) => {setErrorsMessages(error.response?.data);
          setModalStatement({color: "text-danger",message: "Error in Adding User to Group!"});}/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/,
        onSettled: () => {
            queryClient.invalidateQueries(['group']);

        },
        onSuccess: () => {
			refetchGroups();
          setModalStatement({color: "text-success",message: "User Added to Group!"});

        }
    })
    const { mutate: mutateDelUserInGroup } = useMutation(deleteUserInGroup, {
      onError: (error) => {setErrorsMessages(error.response?.data);
        setModalStatement({color: "text-danger",message: "Error in Removing User from Group!"});}/*alert(`Error on adding translation: ${JSON.stringify(error.response?.data, null, 4)}`)*/,
      onSettled: () => {
          queryClient.invalidateQueries(['group']);

      },
      onSuccess: () => {
        refetchGroups();
        setModalStatement({color: "text-success",message: "User Remove from Group!"});
        //setShow(false);
      }
  })


      function handleSubmitAddSearch (){
        mutateAddUserInGroup({ id: group.id, email: formData.email });
      };

      function handleSubmitRemove (emailId) {
        mutateDelUserInGroup({ id: group.id, email: emailId });
      };
      function handleSubmitRemoveSearch () {
        mutateDelUserInGroup({ id: group.id, email: formData.email });
      };
    return (
		<QuickModal className='modal-dialog-scrollable modal-dialog-centered' show={show} setShow={setShow}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Users in Group</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className='mb-1'>
						<Form.Label className='fw-bold  '>
							User Count:
							{isLoading ? (
									<Spinner className='m-4 text-primary' />
								) : isError ? (
									<ErrorHandler error={error} />
								) : 
								(<div className='fw-normal'>{GroupInfo.usersCount}</div>)}
						</Form.Label>
					</Form.Group>

					<Form.Group className='mb-1'>
						<Form.Label className='fw-bold  '>
							Users:
							<div className='fw-normal'>
								{isLoading ? (
									<Spinner className='m-4 text-primary' />
								) : isError ? (
									<ErrorHandler error={error} />
								) : (
									<div className='flex-row row mx-1' style={{ wordBreak: 'keep-all' }}>
										{GroupInfo.users.map((item, index) => {
											return (
                        
													<Col key={index} className=' me-1 my-1 rounded p-1 text-white bg-dark border border-2 border-light'>
														<Row className='d-flex'>
															<Col className='col-2 me-0 pe-0 d-flex '>
																<TiDelete
																	type='button'
																	onClick={()=>{handleSubmitRemove(item.email)}}
																	className='position-absolute m-0 p-0'
																	size={25}
																/>
															</Col>
															<Col className='col-10 mx-0 px-0 ps-1  break-word overflow-hidden '>
																<Row className='mx-1 px-1 break-word overflow-hidden'>
																	{item.firstName}
																</Row>
                                <Row className='mx-1 px-1 break-word overflow-hidden'>
																	{item.lastName}
																</Row>
																
															</Col>
                              <Row className='mx-2 px-2 break-word overflow-hidden'>{item.email}</Row>
														</Row>
													</Col>
											);
										})}
									</div>
								)}
							</div>
						</Form.Label>
					</Form.Group>
          <div className='text-danger fw-normal  rounded p-1 '>{errorsMessages}</div>
					<Form.Group className='mb-3 d-flex justify-content-center'>
						<input autoFocus id='name'
							type='text'
              name="email"
							value={formData.email}
							onChange={handleChange}
							className='form-control w-50 rounded-0 rounded-start'
							placeholder='User Email'
							aria-label="Recipient's username"
							aria-describedby='User Add/Remove'
						/>
						<div className='input-group-append'>
							<button className='btn btn-danger rounded-0' onClick={()=>{handleSubmitRemoveSearch()}} type='button'>
								Remove
							</button>
							<button className='btn text-white btn-success rounded-0 rounded-end' onClick={()=>{handleSubmitAddSearch()}}type='button'>
								Add
							</button>
						</div>
					</Form.Group>
          <div className={` ${ModalStatement?.color} fw-semibold  rounded p-1 `}>{ModalStatement?.message}</div>
				</Form>
			</Modal.Body>
		</QuickModal>
	);
}