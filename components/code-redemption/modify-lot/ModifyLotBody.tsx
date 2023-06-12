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

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useRouter } from "next/router";

import { useForm, FormProvider, Controller, SubmitHandler, SubmitErrorHandler, SetValueConfig } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import { modifyLotSchema } from '@/components/helpers/schemas/FormSchemas';
import { ModifyLotForm } from '@/components/helpers/interfaces/FormInterfaces';
import { enqueueSnackbarHelper } from '@/components/helpers/UtilHelper';
import { GenericResponseError, GenericResultsSuccessResponse } from '@/components/helpers/ResponseHelpers';
import CodeLotDetails from '@/components/code-redemption/code-lot-results/CodeLotResults';

import axios from "axios";
import { useSnackbar } from 'notistack';


const modifyOptions: string[] = [
    'Change Expiration Date'
]

const initialValues: ModifyLotForm = {
    lotName: '',
    modification: '',
    expiration: '',

    codeLotDetails: [],

    successful: false,
    successMessage: '',
    extraSuccessMessage: '',
}

export default function ModifyLotBody({ lots }: { lots: string[] }) {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setValueConfig: SetValueConfig = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

    const form = useForm<ModifyLotForm>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: initialValues,
        resolver: yupResolver(modifyLotSchema)
    });

    const {
        setValue,
        handleSubmit,
        setError,
        control,
        formState: { isSubmitting },
        watch
    } = form;

    const onError: SubmitErrorHandler<ModifyLotForm> = async (formData, e) => {
        console.error(formData);
    }

    const onSubmit: SubmitHandler<ModifyLotForm> = async (formData, e) => {
        try {
            const { data } = await axios.post<GenericResultsSuccessResponse | GenericResponseError>(
                process.env.CODE_REDEMPTION_MODIFY_LOT_ENDPOINT,
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
                            enqueueSnackbarHelper('Error modifying code lot', enqueueSnackbar, closeSnackbar);
                            setError('lotName', { type: 'custom', message: data.message });
                            return;
                        case 9999:
                            router.push(process.env.CODE_REDEMPTION_UNAVAILABLE + '?error=' + data.message);
                            return;
                        default:
                            break;
                    }
                } else {
                    if (data.errorCode == 9999) {
                        router.push(process.env.CODE_REDEMPTION_UNAVAILABLE);
                        return;
                    }
                }

                enqueueSnackbarHelper("Unable to submit form due to a internal server error.", enqueueSnackbar, closeSnackbar);

                return
            } else {
                setValue('successful', true, setValueConfig);

                setValue('successMessage', data.message, setValueConfig);

                setValue('extraSuccessMessage', data.extraMessage, setValueConfig);

                setValue('codeLotDetails', data.codeLotDetails, setValueConfig);
            }

            return;
        } catch (error: any) {
            if (error.response) {
                const { data } = error.response;

                if (data.message) {
                    switch (data.errorCode) {
                        case 9997:
                        case 9998:
                            enqueueSnackbarHelper('Error modifying code lot', enqueueSnackbar, closeSnackbar);
                            setError('lotName', { type: 'custom', message: data.message });
                            return;
                        case 9999:
                            router.push(process.env.CODE_REDEMPTION_UNAVAILABLE + '?error=' + data.message);
                            return;
                        default:
                            break;
                    }
                } else {
                    if (data.errorCode == 9999) {
                        router.push(process.env.CODE_REDEMPTION_UNAVAILABLE);
                        return;
                    }
                }
            }

            enqueueSnackbarHelper("Unable to submit form due to a internal server error.", enqueueSnackbar, closeSnackbar);

            return
        }
    }

    const modification = watch('modification');

    const successful = watch('successful');
    const successMessage = watch('successMessage');
    const extraSuccessMessage = watch('extraSuccessMessage');

    return (
        <div>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <Grid container spacing={2} columns={12}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card elevation={10}>
                                <CardHeader
                                    titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left' }}
                                    title="Modify Lot"
                                    subheader="Please fill out all required fields."
                                    subheaderTypographyProps={{ textAlign: 'left' }}
                                />

                                <Divider color='#1976d2' variant='middle' />

                                <CardContent>
                                    <Grid item container spacing={2} xs={12} sm={12} md={12}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <Controller
                                                control={control}
                                                name='lotName'
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

                                        <Grid item xs={12} sm={12} md={6}>
                                            <Controller
                                                control={control}
                                                name='modification'
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
                                                        label="Modification"
                                                        variant="outlined"
                                                        required

                                                        select
                                                        SelectProps={{ MenuProps: { autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true, disableAutoFocus: true, } }}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    >
                                                        <MenuItem disabled value="" hidden>
                                                            <em>Modification</em>
                                                        </MenuItem>

                                                        {modifyOptions.map((option) => (
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

                                        <Grid item xs={12} sm={12} md={6} hidden={!(modification == 'Change Expiration Date')}>
                                            <Controller
                                                control={control}
                                                name='expiration'
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <DatePicker
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        ref={field.ref}
                                                        slotProps={{
                                                            textField: {
                                                                helperText: error?.message,
                                                                required: (modification == 'Change Expiration Date'),
                                                                fullWidth: true,
                                                                error: !!error
                                                            }
                                                        }}
                                                        inputRef={field.ref}
                                                        label="Expiration Date"
                                                    />
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
                                                Modify Lot
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

                                        <Grid item xs={12} sm={12} md={12} hidden={!extraSuccessMessage}>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                                {extraSuccessMessage}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12}>
                                            <CodeLotDetails />
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