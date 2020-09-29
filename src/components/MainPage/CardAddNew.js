import React from 'react';
import AddIcon from '@material-ui/icons/Add';

function CardAddNew() {
    return (
        <div className="add-new-root">
            <div className="container">
                <div className="icon-container">
                    <AddIcon />
                </div>

                <p>클래스 추가</p>
            </div>
        </div>
    );
}

export default CardAddNew;
