import React, { useState, useEffect } from 'react';
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import ServiceModal from './ServiceModal';
import axios from 'axios';
import './AdminServices.css'

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingService, setEditingService] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [serviceData, setServiceData] = useState({
        service_name: ''
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:8000/services/');
            setServices(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };
    const handleUpdateClick = async () => {
        try {
            await axios.put(`http://localhost:8000/services/${editingService}`, serviceData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            fetchServices();
            setEditingService(null);
        } catch (error) {
            console.error('Error updating organization name:', error);
            if (error.response) {
                console.error('Server response:', error.response.data);
            }
        }
    };

    const handleDeleteClick = async (serviceId) => {
        try {
            await axios.delete(`http://localhost:8000/services/${serviceId}`);
            fetchServices();
        } catch (error) {
            console.error('Error deleting vendor:', error);
        }
    };

    const handleEditClick = (service) => {
        setEditingService(service.service_id);
        setServiceData({
            service_name: service.service_name,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData(prevData => ({ ...prevData, [name]: value }));
    };
  
    const filteredServices = services.filter((service) => {
        const name = service.service_name;
        // console.log('Organization:', organization);
        // console.log('Organization Name:', name);

        return typeof name === 'string' && name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Handler for search input change
    const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    };

    // Handler for search button click
    const handleSearchClick = (event) => {
    event.preventDefault();
    // Perform search action here if needed
    };

    const confirmDelete = (vendorId) => {
        if (window.confirm("Are you sure you want to delete this vendor?")) {
          handleDeleteClick(vendorId);
        }
      };
    

    return (
        <div className='dash-org-list'>
            <form className="admin d-flex " role="search" >
                    <input className="form-control"  value={searchQuery} onChange={handleSearchChange} type="search" placeholder= "Search " aria-label="Search"/>
                    <button  className="dash-search-btn" type="submit" onClick={handleSearchClick}><i class="bi bi-search"></i></button>
                    </form>
            <h1>Services List</h1>
            <button className='admin form-btn'  onClick={() => setShowModal(true)}>Add <i class=" bi bi-person-plus-fill " style={{marginLeft:"0.5rem", marginRight:"0.5rem" }}></i></button>           
            <br/>
            <div className='table-wrapper'>
            <div className='table-data'>
            <table>
                <thead>
                    <tr>
                        <th >Service ID</th>
                        <th className='expand-service'>Service Name</th>
                        <th className='expand-service'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {filteredServices.map(service => (
                        <tr key={service.service_id}>
                            <td style={{textIndent:"32%"}}>{service.service_id}</td>
                            <td>{service.service_name}</td>
                            <td>
                                    <span className='actions'>
                                        <BsFillPencilFill onClick={() => handleEditClick(service)} />
                                        <BsFillTrashFill className="delete-btn" onClick={() => confirmDelete(service.service_id)} />
                                    </span>
                                </td>
                            </tr>
                    ))}
                </tbody>
            </table>

            {editingService && (
                    <div className='vendor-update'>
                        <div className='update-form'>
                            <h2>Edit Service</h2>
                            <form>
                                <div className='update-form-gr'>
                                <input name="service_name" value={serviceData.service_name} onChange={handleChange} placeholder="Service" className='update-form-grp' />                                    <br />
                                    <button type="button" onClick={handleUpdateClick} className='form-btn'>Update</button>
                                    <button type="button" onClick={() => setEditingService(null)} className='cancel-btn'>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showModal && (
                    <ServiceModal closeModal={() => setShowModal(false)} fetchServices={fetchServices} />
                )}

            </div>
            </div>
        </div>
    );
}

export default AdminServices;
