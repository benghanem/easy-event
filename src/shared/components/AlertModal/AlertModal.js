import React, {Fragment} from 'react';

import Modal from '../Modal/Modal';
import Button from '../FormElements/Button/Button';
import Text from "../UIElement/Text/Text";

const AlertModal = props => {
    return (
        <Modal
            onCancel={props.onClear}
            header={props.header}
            show={!!props.message}
            footer={
                <Fragment>
                    {props.to && props.to.map(item => {
                        return (
                            <Button to={item.link}
                                    size={!!item.size}
                                    inverse={!!item.inverse}
                                    clear={!!item.clear}
                                    danger={!!item.danger}
                            >
                                {item.value}
                            </Button>)
                    })
                    }
                    <Button onClick={props.onClear} >DISMISS</Button>
                </Fragment>
            }
        >
            <Text  type={!!props.type ? props.type : 'info'}
                    bold>
                {props.message}
            </Text>
        </Modal>
    );
};

export default AlertModal;
