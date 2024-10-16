import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import DisplaySimpleCard from './SimpleDisplayCard';
import { DataContext } from './dataProcess/dataContext';

const DisplayCardsRow = ({generated_data}) => {

  const { data_global, node_displayed } = useContext(DataContext); 

  return (
    <Row gutter={16} justify="center">
      <Col span={8}>
        <DisplaySimpleCard formData={node_displayed} />
      </Col>
      <Col span={8}>
        <DisplaySimpleCard formData={generated_data} />
      </Col>
      <Col span={8}>
        <DisplaySimpleCard formData={data_global} />
      </Col>
    </Row>
  );
};

export default DisplayCardsRow;
