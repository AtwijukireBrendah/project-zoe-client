import React, { useState } from 'react';
import * as yup from 'yup';
import { Box, Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditDialog from '../../../../components/EditDialog';
import XForm from '../../../../components/forms/XForm';
import { reqEmail, reqObject, reqString } from '../../../../data/validations';
import { XMapsInput } from '../../../../components/inputs/XMapsInput';
import { XRemoteSelect } from '../../../../components/inputs/XRemoteSelect';
import { remoteRoutes } from '../../../../data/constants';
import { FormikHelpers } from 'formik';
import { post, handleError } from '../../../../utils/ajax';
import Toast from '../../../../utils/Toast';
import { IContact } from '../../types';
import XTextInput from '../../../../components/inputs/XTextInput';

const schema = yup.object().shape({
  churchLocation: reqObject,
  residence: reqString,
});

//MC JOIN
const mcSchema = yup.object().shape({
  email: reqEmail,
  residence: reqString,
  contact: reqString,
});

const initialValues = {
  churchLocation: '',
  residence: '',
};

interface IProps {
  contact: IContact;
}

const NewGroupJoinRequestForm = (props: IProps) => {
  const [dialog, setDialog] = useState<boolean>(false);

  //Join MC state Hook
  const [joinMC, setJoinMC] = useState<boolean>(false);

  const handleAddNew = () => {
    setDialog(true);
  };

  const handleClose = () => {
    setDialog(false);
  };

  //Join MC
  const handleJoinMc = () => {
    setJoinMC(true);
  };

  const closeDialog = () => {
    setJoinMC(false);
  };

  const getPrimaryEmail = () => {
    const emailList = props.contact.emails;
    for (let i = 0; i < emailList.length; i++) {
      if (emailList[i].isPrimary) {
        return emailList[i].value;
      }
    }
    return emailList[0].value;
  };

  const getPrimaryPhone = () => {
    const phoneList = props.contact.phones;
    for (let i = 0; i < phoneList.length; i++) {
      if (phoneList[i].isPrimary) {
        return phoneList[i].value;
      }
    }
    return phoneList[0].value;
  };

  const handleSubmit = (values: any, actions: FormikHelpers<any>) => {
    const toSave = {
      contactId: props.contact.id,
      email: getPrimaryEmail(),
      phone: getPrimaryPhone(),
      churchLocation: values.churchLocation.id,
      residencePlaceId: values.residence.place_id,
      residenceDescription: values.residence.description,
    };

    post(remoteRoutes.groupsRequest, toSave, () => {
      Toast.success('Group join request successfully sent');
      handleClose();
      actions.resetForm();
    });
  };

  return (
    <>
      <Box display="flex">
        <Box pr={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            New Request &nbsp;&nbsp;
          </Button>
        </Box>

        <Box pr={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleJoinMc}
          >
            Join MC &nbsp;&nbsp;
          </Button>
        </Box>
      </Box>
      <EditDialog
        open={dialog}
        onClose={handleClose}
        title="Request to join group"
      >
        <XForm
          onSubmit={handleSubmit}
          schema={schema}
          initialValues={initialValues}
        >
          <div style={{ padding: 8 }}>
            <Grid spacing={2} container className="min-width-100">
              <Grid item xs={12}>
                <XRemoteSelect
                  remote={remoteRoutes.groupsCombo}
                  name="churchLocation"
                  label="Group"
                  variant="outlined"
                  margin="none"
                  searchOnline
                />
              </Grid>

              <Grid item xs={12}>
                <XMapsInput
                  name="residence"
                  label="Residence"
                  variant="outlined"
                  margin="none"
                  placeholder="type to search"
                />
              </Grid>
            </Grid>
          </div>
        </XForm>
      </EditDialog>
    </>
  );
};

export default NewGroupJoinRequestForm;
