import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import DisplaySimpleCard from './SimpleDisplayCard';
import { DataContext } from './dataProcess/dataContext';

const DisplayCardsRow = () => {

  const { data_global } = useContext(DataContext); 

  return (
    <Row gutter={16} justify="center">
      <Col span={8}>
        <DisplaySimpleCard formData={data_global} />
      </Col>
      <Col span={8}>
        <DisplaySimpleCard formData={data_global} />
      </Col>
      <Col span={8}>
        <DisplaySimpleCard formData={data_global} />
      </Col>
    </Row>
  );
};

export default DisplayCardsRow;
