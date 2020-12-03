import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import TOFELEditor from '../components/TOFELEditor/TOFELEditor';
import * as $ from 'jquery';
import { apiUrl } from '../configs/configs';
import styled from 'styled-components';

const InfoContainer = styled.div`
    padding: 8px;
`;

function MakeContents({ match, history }) {
    const [testData, setTestData] = useState(undefined);
    const [requestFile, setRequestFile] = useState(undefined);
    const [infoData, setInfoData] = useState({ title: '', time_limit: '', eyetrack: '' });
    useEffect(() => {
        $('.tofel-editor-root').css({ 'z-index': 1111, position: 'relative' });
        const { id } = match.params;
        Axios.get(`${apiUrl}/assignment-admin/${id}`, { withCredentials: true })
            .then((res) => {
                const { title, time_limit, eyetrack, contents_data, file_url } = res.data;
                let dataParsed = [
                    {
                        title: [''],
                        passageForRender: [''],
                        passageForEditor: `{"ops":[{"insert":"\n"}]}`,
                        problemDatas: [],
                    },
                ];
                if (contents_data) {
                    dataParsed = JSON.parse(contents_data);
                }
                console.log(dataParsed);
                setInfoData({ ...infoData, title: title, time_limit: time_limit, eyetrack: eyetrack });
                setTestData(dataParsed);
                setRequestFile(file_url);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div style={{ height: 'calc(100vh - 128px)', marginTop: -64 }}>
            <TOFELEditor id={match.params.id} datas={testData} requestFile={requestFile} timeLimit={infoData.time_limit} />
            <InfoContainer>
                과제명: {infoData.title} | 제한시간: {infoData.time_limit}초 | 시선흐름 측정 여부: {infoData.eyetrack ? '예' : '아니오'}
            </InfoContainer>
        </div>
    );
}

export default React.memo(MakeContents);
