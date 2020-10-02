import React from 'react';
import AddIcon from '@material-ui/icons/Add';

function CardAddNew({ children, ...rest }) {
    return (
        <div className="add-new-root" onClick={rest.onClick}>
            <div className="container">
                <div className="icon-container">
                    <AddIcon />
                </div>
                <p>{children}</p>
            </div>
        </div>
    );
}

export default CardAddNew;
