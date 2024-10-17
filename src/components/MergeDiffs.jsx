import React, { useContext } from 'react';
import { Row, Col } from 'antd';
import DisplaySimpleCard from './SimpleDisplayCard';
import { DataContext } from './dataProcess/dataContext';
import FinalEditContentCard from './GenerateFinalEditCard';

const DisplayCardsRow = ({generated_data}) => {

  const { data_global, node_displayed } = useContext(DataContext); 

  return (
    <Row gutter={16} justify="center">
      <Col span={8}>
        <DisplaySimpleCard name={"Original"} formData={node_displayed} />
      </Col>
      <Col span={8}>
        <DisplaySimpleCard name={"Generated"} formData={generated_data} />
      </Col>
      <Col span={8}>
        <FinalEditContentCard generatedData={generated_data} />
      </Col>
    </Row>
  );
};

export default DisplayCardsRow;
