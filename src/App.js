import { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal } from 'antd';
import axios from 'axios';

import './App.css';

const App = () => {

  const [userData, setUserData] = useState([]);
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [currentItem, setCurrentItem] = useState('');
  const [currentData, setCurrentData] = useState({});

  const getUser = () => {
    axios.get('http://localhost:8000/user_details')
      .then((res) => {
        setUserData(res?.data);
      })
      .catch((err) => {
        message.error('Data does not exist');
      })
  };

  useEffect(() => {
    getUser();
  }, []);

  const openUserForm = (flag = false, selectedItem = '', currentData = {}) => {
    setIsOpenAddUser(flag);
    setCurrentItem(selectedItem);
    setCurrentData(currentData);
  };

  const onFormSubmit = (formProps) => {
    if (currentItem === 'add') {
      axios.post('http://localhost:8000/user_details', formProps)
        .then((res) => {
          setCurrentItem('');
          setIsOpenAddUser(false);
          getUser();
          message.success('User added successfully');
        })
        .catch((err) => {
          setCurrentItem('');
          setIsOpenAddUser(false);
        });
    } else {
      axios.put(`http://localhost:8000/user_details/${currentData.id}`, {...formProps, id: currentData.id})
        .then((res) => {
          setCurrentItem('');
          setIsOpenAddUser(false);
          getUser();
          message.success('User details edited successfully');
        })
        .catch((err) => {
          setCurrentItem('');
          setIsOpenAddUser(false);
        });
    }
  };

  const onDelete = (currentId) => {
    axios.delete(`http://localhost:8000/user_details/${currentId}`)
      .then(() => {
        getUser();
        message.success('Data deleted successfully')
      })
  };

  const renderContent = (currentItem, currentData) => {
    return (
      <div>
        <h1 className='modal_header'>{currentItem} User</h1>
        <Form
          name="user_form"
          onFinish={onFormSubmit}
          initialValues={currentData ? currentData : {}}
        >
          <Form.Item
            label="Username"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[
              {
                required: true,
                message: 'Please input your age!',
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="College"
            name="college"
            rules={[
              {
                required: true,
                message: 'Please input your college!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='w-100'
          >
            Save
          </Button>
        </Form>
      </div>
    )
  };

  return (
    <div className="App">
      <header>
        User CRUD operation
      </header>

      <Button type='primary' onClick={() => openUserForm(true, 'add')}>Add user</Button>

      <div className='user-wrapper'>
        {
          userData.map((data, index) => {
            return (
              <div className='box' key={index}>
                <div>Name: {data.name}</div>
                <div>Age: {data.age}</div>
                <div>College: {data.college}</div>

                <div className='btn-wrapper'>
                  <Button type='primary' onClick={() => openUserForm(true, 'edit', data)}>Edit</Button>
                  <Button type='primary' onClick={() => onDelete(data.id)}>Delete</Button>
                </div>
              </div>
            )
          })
        }
      </div>

      <Modal
        open={isOpenAddUser}
        onCancel={() => openUserForm(false)}
        footer={null}
        destroyOnClose={true}
      >
        <div className='modal_wrapper'>
          {renderContent(currentItem, currentData)}
        </div>
      </Modal>
    </div>
  );
}

export default App;
