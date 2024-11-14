import React, { useState } from "react";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import { DeleteOutlined } from "@ant-design/icons";

export default function Del_button(props) {
    const [visible, setVisible] = useState(false);
    const delFunction = props.delFunction;

    const toggleModal = () => setVisible(!visible);

    return (
        <>
            {/* Delete Button */}
            <Button 
                icon={<DeleteOutlined />} 
                onClick={toggleModal} 
                type="text"
            />
            
            {/* Confirmation Modal */}
            <Modal
                title="Êtes-vous sûr ?"
                visible={visible}
                onCancel={toggleModal}
                footer={[
                    <Button key="close" onClick={toggleModal}>
                        Fermer
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        onClick={() => {
                            console.log(props.item);
                            delFunction(props.item); // Call delete function
                            props.reRender(); // Trigger re-render
                            toggleModal(); // Close modal
                        }}
                    >
                        Supprimer
                    </Button>
                ]}
            >
                {/* You can add a message or other content here */}
            </Modal>
        </>
    );
}
