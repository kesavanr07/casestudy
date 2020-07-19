import React, {Component} from 'react'
import { Col, Form,Row, Button, FormControl, Jumbotron, Alert } from 'react-bootstrap';
import UserList from './UserList.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';

class UserForm extends Component {
    constructor(props) {
        super(props);
        const input_fields = {
            username : '',
            email_id : '',
            job_type : '',
            phone_number : '',
            profile:null,
            profile_file:null,
            profile_selected:false,
            preferred_location : null
        };
        this.state = {
            ...input_fields,
            date_of_birth : new Date(),
            err_msg : {
                is_error : false,
                save_user_msg : "",
                date_of_birth : "",
                ...input_fields
            },
            data_added : false
        };
        this.selectedLocation = null;
        this.save_button_triggered = false;

        this.all_location = [
            { Id: 'chennai', Location: 'chennai' },
            { Id: 'bangalore', Location: 'Bangalore' },
            { Id: 'hyderabad', Location: 'Hyderabad' },
            { Id: 'kerela', Location: 'Kerela' },
            { Id: 'pune', Location: 'Pune' },
            { Id: 'delhi', Location: 'Delhi' },
            { Id: 'Cochin', Location: 'Cochin' }
        ];
        this.all_location_fields = { text: 'Location', value: 'Id' };

    }
    
    getEditUser = () => {
        if(!this.props.match.params.id) {

        }
    }
    getChangedValue = (event) => {
        const { id, value } = event.target;
        const {err_msg} = this.state;

        if(err_msg[id])
            err_msg[id] = "";
            
        this.setState({
            [id] : value,
            err_msg
        });
    }

    handleCustomChange = (data, value = '') => {
        const {err_msg} = this.state;

        if(data === 'job_type' || data === 'preferred_location') {
            if(err_msg[data])
                err_msg[data] = "";

            this.setState({
                [data]: value,
                err_msg
            });    
        } else {
            if(err_msg['date_of_birth'])
                err_msg['date_of_birth'] = "";

            this.setState({
                date_of_birth: data,
                err_msg
            });
        }
        
    };
    
    handleLocationValue = () => {
        const {value} = this.selectedLocation;
        console.log('value :>> ', value);
        this.handleCustomChange('preferred_location', value);
    }

    resetForm = (reset_all = false) => {
        const input_fields = this.state;

        if(reset_all) {
            Object.keys(input_fields.err_msg).map((key) => {
                input_fields.err_msg[key] = (key !== 'is_error') ? '' : false;
            });
        }
        Object.keys(input_fields).map((key) => {
            if(key !== 'err_msg') {
                input_fields[key] = (key !== 'data_added') ? '' : false;
            }
        });
        this.setState({
            input_fields
        });
    }

    closeAlert = () => {
        const {err_msg}       = this.state;
        
        err_msg.is_error      = false;
        err_msg.save_user_msg = '';

        this.setState({
            err_msg
        });
    }

    submitUserDetails = () => {
        const input_fields = this.state;
        const email_reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        const phone_reg =  /^\d+$/;

        Object.keys(input_fields.err_msg).map((key) => {
            input_fields.err_msg[key] = (key !== 'is_error') ? '' : false;
        });

        Object.keys(input_fields).map((key) => {
            if(key !== 'err_msg' && key !== 'data_added' && key !== 'profile_file' && key !== 'profile_selected') {
                if(!input_fields[key] || input_fields[key].length === 0) {
                    if(key === 'profile' && !input_fields['profile_selected']) {
                        input_fields.err_msg[key] = "Please select Profile picture";
                        input_fields.err_msg.is_error = true;
                    } else if(key !== 'profile') {
                        input_fields.err_msg.is_error = true;
                        input_fields.err_msg[key] = "Please enter " +(key).replace(/_/g, " ");
                    }
                } else {
                    if(key === 'email_id' && email_reg.test(input_fields[key]) === false)  {
                        input_fields.err_msg[key] = "Please enter valid email id";
                        input_fields.err_msg.is_error = true;
                    }
                        
                    if(key === 'phone_number' && phone_reg.test(input_fields[key]) === false) {
                        input_fields.err_msg[key] = "Please enter valid phone number";
                        input_fields.err_msg.is_error = true;
                    }
                }
            }
        });
        
        this.setState({
            ...input_fields
        });

        if(input_fields.err_msg.is_error === false)
            this.uploadProfile();
    }

    addUser = async () => {

        const {
            username, 
            email_id, 
            profile, 
            job_type, 
            date_of_birth, 
            phone_number, 
            preferred_location,
            err_msg
        } = this.state;
        console.log('username :>> ', username);
        var {data_added} = this.state;
        
        data_added = err_msg.is_error = false;
        
        err_msg.save_user_msg   = "";

        try {
            const response = await fetch("http://localhost:8000/users/save", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },  
                body : JSON.stringify({
                    username,
                    email_id,
                    job_type,
                    date_of_birth,
                    phone_number,
                    profile,
                    preferred_location : preferred_location.join(', ')
                })
            });
            const user_data = await response.json();

            if(user_data && user_data.status === "success") {
                err_msg.save_user_msg = user_data.data;
                data_added = true;
            } else {
                err_msg.save_user_msg = (user_data && user_data.data) || "Unexpected error occured";
                err_msg.is_error = true;
            }
            this.save_button_triggered = false;
        } catch (error) {
            err_msg.save_user_msg = "Unexpected error occured"
            err_msg.is_error= true;
            this.save_button_triggeredsave_button_triggered = false;
        }
        if(data_added === true) {
            this.setState({
                data_added
            });
            this.resetForm();
        } else {
            this.setState({
                err_msg,
            });
        }
    }


    uploadProfile = async () => {
        if(this.save_button_triggered) return;
            this.save_button_triggered = true
        const {profile_file, err_msg} = this.state;
        try {
            const form_data = new FormData();

            form_data.append('file', profile_file);
    
            const response = await fetch("http://localhost:8000/users/upload_profile", {
                method: 'POST',
                body: form_data
            });
            const profile_data = await response.json();

            if(profile_data && profile_data.status === "success") {
                this.setState({ 
                    profile : profile_data.data, 
                }, () => {
                    this.addUser();
                });
            } else {
                this.save_button_triggered = false;
                err_msg.profile = (profile_data && profile_data.data) || "Unexpected error occured";
                err_msg.is_error = true;
                this.setState({err_msg });
            }
        } catch (error) {
            this.save_button_triggered = false;
            err_msg.profile = "Unexpected error on uploading file";
            err_msg.is_error= true;
            this.setState({err_msg });
        }
    }

    getFileValue = (event) => {
        const {err_msg} = this.state;

        err_msg.profile = '';

        this.setState({
            profile_file: event.target.files[0],
            profile_selected: true,
            err_msg
        });      
    }

    deleteTrain = async (id) => {
        var {err_msg, data_added} = this.state;
        data_added = err_msg.is_error = false;
        
        err_msg.save_user_msg   = "";
        try {
            const response  = await fetch("http://localhost:8000/users/delete", { 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },  
                body : JSON.stringify({
                    _id : id
                })
            });

            const user_data = await response.json();

            if(user_data && user_data.status === "success") {
                err_msg.save_user_msg = user_data.data;
                data_added = true;
            } else {
                err_msg.save_user_msg = (user_data && user_data.data) || "Unexpected error occured";
                err_msg.is_error= true;
            }
        } catch (error) {
            err_msg.save_user_msg = "Unexpected error occured"
            err_msg.is_error= true;
        }
        
        this.setState({
            err_msg,
            data_added
        });     
    }

    render() {
        const input_fields = this.state;
          
        return (
            <Jumbotron>

            <Col md={{ span: 12, offset: 0 }}>
                {!input_fields.err_msg.is_error && input_fields.err_msg.save_user_msg !== "" &&
                    <Alert variant="success" onClose={this.closeAlert} dismissible>{input_fields.err_msg.save_user_msg}</Alert>
                }
                {input_fields.err_msg.is_error && input_fields.err_msg.save_user_msg !== "" &&
                    <Alert variant="danger" onClose={this.closeAlert} dismissible>{input_fields.err_msg.save_user_msg}</Alert>
                }
                
                <h3 className="text-center">Add User</h3><br/>
                <Form>
                    <Form.Group as={Row}>
                        <Col sm="6" as={Row}>
                            <Form.Label column sm="4" className="text-right">
                                Full Name
                            </Form.Label>
                            <Col sm="8">
                                <FormControl 
                                    type="text"
                                    id="username"
                                    placeholder="Full Name"
                                    value={input_fields.username}
                                    onChange={this.getChangedValue}
                                />
                                {input_fields.err_msg.username &&
                                    <Form.Text className="text-error">{input_fields.err_msg.username}</Form.Text>
                                }
                            </Col>
                        </Col>
                        <Col sm="6" as={Row}>
                            <Form.Label column sm="4" className="text-right">
                                Profile
                            </Form.Label>
                            <Col sm="8">
                                <FormControl 
                                    type="file"
                                    id="profile"
                                    onChange={this.getFileValue}
                                />
                                {input_fields.err_msg.profile &&
                                    <Form.Text className="text-error">{input_fields.err_msg.profile}</Form.Text>
                                }
                            </Col>
                        </Col>

                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm="6" as={Row}>
                            <Form.Label column sm="4" className="text-right">
                                Phone Number
                            </Form.Label>
                            <Col sm="8">
                                <FormControl 
                                    type="text"
                                    id="phone_number"
                                    value={input_fields.phone_number}
                                    placeholder="Phone Number"
                                    onChange={this.getChangedValue}
                                    maxLength="10"
                                />
                                {input_fields.err_msg.phone_number &&
                                    <Form.Text className="text-error">{input_fields.err_msg.phone_number}</Form.Text>
                                }
                            </Col>
                        </Col>
                        <Col sm="6" as={Row}>
                            <Form.Label column sm="4" className="text-right">
                                Email Id
                            </Form.Label>
                            <Col sm="8">
                                <FormControl 
                                    type="text"
                                    id="email_id"
                                    placeholder="Email Id"
                                    value={input_fields.email_id}
                                    onChange={this.getChangedValue}
                                />
                                {input_fields.err_msg.email_id &&
                                    <Form.Text className="text-error">{input_fields.err_msg.email_id}</Form.Text>
                                }
                            </Col>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm="6" as={Row}>
                            <Form.Label column sm="4" className="text-right">
                                Addess line 1
                            </Form.Label>
                            <Col sm="8" className="custom-checkbox">
                                <Button 
                                    variant={input_fields.job_type == 'ft' ? "outline-info" : "info"} 
                                    onClick={() => this.handleCustomChange('job_type', 'ft')}>FT
                                </Button> 
                                <Button 
                                    variant={input_fields.job_type == 'pt' ? "outline-info" : "info"} 
                                    onClick={() => this.handleCustomChange('job_type', 'pt')}>PT
                                </Button>
                                <Button 
                                    variant={input_fields.job_type == 'consultant' ? "outline-info" : "info"} 
                                    onClick={() => this.handleCustomChange('job_type', 'consultant')}>Consultant
                                </Button>
                                {input_fields.err_msg.job_type &&
                                    <Form.Text className="text-error">{input_fields.err_msg.job_type}</Form.Text>
                                }
                            </Col>
                        </Col>
                        <Col sm="6" as={Row}>
                            <Form.Label column sm="4" className="text-right">
                                    DOB
                            </Form.Label>
                            <Col sm="8">
                                <DatePicker
                                    className="form-control"
                                    id="date_of_birth"
                                    selected={input_fields.date_of_birth}
                                    onChange={this.handleCustomChange}
                                    dateFormat="MM/dd/yyyy"
                                    maxDate={new Date()}

                                />
                                {input_fields.err_msg.date_of_birth &&
                                    <Form.Text className="text-error">{input_fields.err_msg.date_of_birth}</Form.Text>
                                }
                            </Col>
                        </Col>
                    </Form.Group>
                    <Form.Group>
                        <Col sm="6" as={Row}>
                            <Form.Label column sm="4" className="text-right">
                                Peferred Location
                            </Form.Label>
                            <Col sm="8">
                                <MultiSelectComponent id="checkbox" 
                                    dataSource={this.all_location} 
                                    fields={this.all_location_fields} 
                                    placeholder="Select Locations" 
                                    mode="CheckBox"
                                    ref={(scope) => { this.selectedLocation = scope; }} 
                                    change={this.handleLocationValue}
                                >
                                    <Inject services={[CheckBoxSelection]}/>
                                </MultiSelectComponent>
                                {input_fields.err_msg.preferred_location &&
                                    <Form.Text className="text-error">{input_fields.err_msg.preferred_location}</Form.Text>
                                }
                            </Col>
                        </Col>
                    </Form.Group>
                    <br/>
                    <Col md={{ span: 10, offset: 1 }}>
                        <Button variant="secondary" disabled={this.save_button_triggered} className="pull-right" onClick={()=> {this.resetForm(true)}}>Reset</Button>
                        <Button className="float-right" onClick={this.submitUserDetails}>Add</Button>
                    </Col>
                </Form>
            </Col>
            <UserList dataAdded={this.state.data_added} deleteTrain={this.deleteTrain} />
            </Jumbotron>
        )
    }
}

export default UserForm;
