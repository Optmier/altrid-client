import React from 'react';
import SearchInput from './SearchInput';
import ClassWrapper from './ClassWrapper';
import FilterButton from './FilterButton';

function ClassHeaderBox() {
    return (
        <div style={{ width: '100%', borderBottom: '1.5px solid #e5e5e5' }}>
            <ClassWrapper>
                <div className="class-input-header">
                    <SearchInput />
                    <FilterButton />
                </div>
            </ClassWrapper>
        </div>
    );
}

export default ClassHeaderBox;
