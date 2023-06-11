import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { useRouter } from "next/router";

import { useForm, FormProvider, Controller, SubmitHandler, SubmitErrorHandler, SetValueConfig, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import { deleteLotSchema } from '@/components/helpers/schemas/FormSchemas';
import { DeleteLotForm } from '@/components/helpers/interfaces/FormInterfaces';
import { enqueueSnackbarHelper } from '@/components/helpers/UtilHelper';
import { GenericResponseError, GenericSuccessResponse } from '@/components/helpers/ResponseHelpers';

import axios from "axios";
import { useSnackbar } from 'notistack';

const initialValues: DeleteLotForm = {
    codeLot: '',
    confirmCodeLot: '',

    successMessage: '',
    successful: false,
}

export default function DeleteLotBody({ lots }: { lots: string[] }) {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setValueConfig: SetValueConfig = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

    const form = useForm<DeleteLotForm>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: initialValues,
        resolver: yupResolver(deleteLotSchema)
    });

    const {
        setValue,
        handleSubmit,
        setError,
        control,
        formState: { isSubmitting },
        watch
    } = form;


    const onError: SubmitErrorHandler<DeleteLotForm> = async (formData, e) => {
        console.error(formData);
    }

    const onSubmit: SubmitHandler<DeleteLotForm> = async (formData, e) => {
        if (formData.codeLot != formData.confirmCodeLot) {
            setError('codeLot', { type: 'custom', message: 'Code Lots must match!' });
            setError('confirmCodeLot', { type: 'custom', message: 'Code Lots must match!' });
            return;
        }

        try {
            const { data } = await axios.post<GenericSuccessResponse | GenericResponseError>(
                process.env.CODE_REDEMPTION_DELETE_LOT_ENDPOINT,
                {
                    formData: formData,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            );

            if (!data.success) {
                if (data.message) {
                    switch (data.errorCode) {
                        case 9997:
                        case 9998:
                            enqueueSnackbarHelper('Error deleting Code Lot', enqueueSnackbar, closeSnackbar);
                            setError('codeLot', { type: 'custom', message: data.message });
                            break;
                        case 9999:
                            router.push(process.env.CODE_REDEMPTION_UNAVAILABLE + '?error=' + data.message);
                            break;
                        default:
                            enqueueSnackbarHelper("Unable to submit form due to a internal server error.", enqueueSnackbar, closeSnackbar);
                            break;
                    }
                } else {
                    if (data.errorCode == 9999) {
                        router.push(process.env.CODE_REDEMPTION_UNAVAILABLE);
                        return;
                    }

                    enqueueSnackbarHelper("Unable to submit form due to a internal server error.", enqueueSnackbar, closeSnackbar);
                }

                return
            } else {
                setValue('successMessage', data.message, setValueConfig);
                setValue('successful', true, setValueConfig);
            }

            return;
        } catch (error: any) {
            if (error.response) {
                const { data } = error.response;

                if (data.message) {
                    switch (data.errorCode) {
                        case 9997:
                        case 9998:
                            enqueueSnackbarHelper('Error deleting Code Lot', enqueueSnackbar, closeSnackbar);
                            setError('codeLot', { type: 'custom', message: data.message });
                            break;
                        case 9999:
                            router.push(process.env.CODE_REDEMPTION_UNAVAILABLE + '?error=' + data.message);
                            break;
                        default:
                            enqueueSnackbarHelper("Unable to submit form due to a internal server error.", enqueueSnackbar, closeSnackbar);
                            break;
                    }
                } else {
                    if (data.errorCode == 9999) {
                        router.push(process.env.CODE_REDEMPTION_UNAVAILABLE);
                        return;
                    }

                    enqueueSnackbarHelper("Unable to submit form due to a internal server error.", enqueueSnackbar, closeSnackbar);
                }
            } else {
                enqueueSnackbarHelper("Unable to submit form due to a internal server error.", enqueueSnackbar, closeSnackbar);
            }

            return
        }
    }

    const successMessage = watch('successMessage');
    const successful = watch('successful');

    return (
        <div>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <Grid container spacing={2} columns={12}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card elevation={10}>
                                <CardHeader
                                    titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left' }}
                                    title="Delete Lot"
                                    subheader="Please fill out all required fields."
                                    subheaderTypographyProps={{ textAlign: 'left' }}
                                />

                                <Divider color='#1976d2' variant='middle' />

                                <CardContent>
                                    <Grid item container spacing={2} xs={12} sm={12} md={12}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <Controller
                                                control={control}
                                                name='codeLot'
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <TextField
                                                        name={field.name}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        inputRef={field.ref}
                                                        onBlur={field.onBlur}

                                                        fullWidth
                                                        label="Code Lot"
                                                        variant="outlined"
                                                        required

                                                        select
                                                        SelectProps={{ MenuProps: { autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true, disableAutoFocus: true, } }}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    >
                                                        <MenuItem disabled value="" hidden>
                                                            <em>Code Lot</em>
                                                        </MenuItem>

                                                        {lots.map((option) => (
                                                            <MenuItem
                                                                value={option}
                                                                key={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12}>
                                            <Controller
                                                control={control}
                                                name='confirmCodeLot'
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <TextField
                                                        name={field.name}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        inputRef={field.ref}
                                                        onBlur={field.onBlur}

                                                        fullWidth
                                                        label="Confirm Code Lot"
                                                        variant="outlined"
                                                        required

                                                        select
                                                        SelectProps={{ MenuProps: { autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true, disableAutoFocus: true, } }}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    >
                                                        <MenuItem disabled value="" hidden>
                                                            <em>Confirm Code Lot</em>
                                                        </MenuItem>

                                                        {lots.map((option) => (
                                                            <MenuItem
                                                                value={option}
                                                                key={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12}>
                                        <CardActions sx={{ justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                type="submit"
                                                disabled={isSubmitting || successful}
                                            >
                                                Delete Lot
                                            </Button>
                                        </CardActions>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12}>
                                        <CardActions sx={{ justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => { router.push(process.env.CODE_REDEMPTION_MAIN_MENU) }}
                                                style={{ float: 'left', marginTop: '10px' }}
                                            >
                                                Return to Main Menu
                                            </Button>
                                        </CardActions>
                                    </Grid>
                                </CardContent>

                                <Divider color='#1976d2' variant='middle' hidden={!successful} />

                                <CardContent hidden={!successful}>
                                    <Grid item container spacing={2}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                                {successMessage}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </div>
    )
}