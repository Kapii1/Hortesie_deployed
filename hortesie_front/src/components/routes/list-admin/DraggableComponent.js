import React from 'react';
import Draggable from 'react-draggable';

class RepositionableComponent extends React.Component {
    render() {
        const { initialPosition, children } = this.props;

        return (
            <div style={{ position: 'absolute' }}>
                {children}
            </div>
        );
    }
}
export default RepositionableComponent;
