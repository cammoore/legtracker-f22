import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';
import LoadingSpinner from './LoadingSpinner';
import { Measures } from '../../api/measure/MeasureCollection';

const ManageMeasures = () => {
  const { ready, measures } = useTracker(() => {
    const rdy = Measures.subscribeMeasures().ready();
    const items = Measures.find({}).fetch();
    return {
      ready: rdy,
      measures: items,
    };
  });
  const [measureData, setMeasureData] = useState([]);
  const [uploadWorking, setUploadWorking] = useState(false);
  const [clearWorking, setClearWorking] = useState(false);
  const collectionName = Measures.getCollectionName();

  const readFile = (e) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        // console.log(jsonData);
        setMeasureData(jsonData);
      } catch (error) {
        console.error('Error reading data', error);
      }
    };
  };

  const uploadData = () => {
    setUploadWorking(true);
    measureData.forEach((definitionData) => {
      defineMethod.callPromise({
        collectionName,
        definitionData,
      }).catch((error) => console.error(`Error defining measure ${definitionData}`, error));
    });
    setUploadWorking(false);
  };

  const clearMeasures = () => {
    setClearWorking(true);
    measures.forEach((measure) => {
      removeItMethod.callPromise({
        collectionName,
        instance: measure._id,
      }).catch((error) => console.error(`Error removing measure ${measure._id}`, error));
    });
    setClearWorking(false);
  };

  return ready ? (
    <Card>
      <Card.Body>
        <Card.Title>Load Measures</Card.Title>
        <Card.Subtitle>There are {measures.length} measures defined.</Card.Subtitle>
        <Row>
          <Col lg={6}>
            <Form.Group controlId="formFile" className="my-3">
              <Form.Label>Select the measures file.</Form.Label>
              <Form.Control type="file" onChange={readFile} className="mb-2" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mt-5">
              <Button variant="primary" onClick={uploadData}>
                {uploadWorking ? 'Loading...' : 'Upload Measures'}
              </Button>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mt-5">
              <Button variant="danger" onClick={clearMeasures}>
                {clearWorking ? 'Clearing...' : 'Clear all Measures'}
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ) : <LoadingSpinner message="Loading measures" />;
};

export default ManageMeasures;
