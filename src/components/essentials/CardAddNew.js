import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames';

function CardAddNew({ children, ...rest }) {
    return (
        <div className={classNames('add-new-root', rest.type === 'students' ? 'students' : null)} onClick={rest.onClick}>
            <div className="container">
                <div className="icon-container">
                    <AddIcon />
                </div>
                <p style={{ fontWeight: '600' }}>{children}</p>
            </div>
        </div>
    );
}

export default CardAddNew;
