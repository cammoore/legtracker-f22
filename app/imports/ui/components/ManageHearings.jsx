import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Hearings } from '../../api/hearing/HearingCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';
import LoadingSpinner from './LoadingSpinner';

const ManageHearings = () => {
  const { ready, hearings } = useTracker(() => {
    const rdy = Hearings.subscribeHearings().ready();
    const items = Hearings.find({}).fetch();
    return {
      ready: rdy,
      hearings: items,
    };
  });
  const [hearingData, setHearingData] = useState([]);
  const [uploadWorking, setUploadWorking] = useState(false);
  const [clearWorking, setClearWorking] = useState(false);
  const collectionName = Hearings.getCollectionName();

  const readFile = (e) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        // console.log(jsonData);
        setHearingData(jsonData);
      } catch (error) {
        console.error('Error reading data', error);
      }
    };
  };

  const uploadData = () => {
    setUploadWorking(true);
    hearingData.forEach((definitionData) => {
      defineMethod.callPromise({
        collectionName,
        definitionData,
      }).catch((error) => console.error(`Error defining Hearing ${definitionData}`, error));
    });
    setUploadWorking(false);
  };

  const clearHearings = () => {
    setClearWorking(true);
    hearings.forEach((hearing) => {
      removeItMethod.callPromise({
        collectionName,
        instance: hearing._id,
      }).catch((error) => console.error(`Error removing Hearing ${hearing._id}`, error));
    });
    setClearWorking(false);
  };

  return ready ? (
    <Card>
      <Card.Body>
        <Card.Title>Load Hearings</Card.Title>
        <Card.Subtitle>There are {hearings.length} hearings defined.</Card.Subtitle>
        <Row>
          <Col lg={6}>
            <Form.Group controlId="formFile" className="my-3">
              <Form.Label>Select the hearings file.</Form.Label>
              <Form.Control type="file" onChange={readFile} className="mb-2" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mt-5">
              <Button variant="primary" onClick={uploadData}>
                {uploadWorking ? 'Loading...' : 'Upload Hearings'}
              </Button>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mt-5">
              <Button variant="danger" onClick={clearHearings}>
                {clearWorking ? 'Clearing...' : 'Clear all Hearings'}
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ) : <LoadingSpinner message="Loading Hearings" />;
};

export default ManageHearings;
