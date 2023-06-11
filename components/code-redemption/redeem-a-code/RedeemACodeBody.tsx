import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from "next/router";

import { useForm, FormProvider, Controller, SubmitHandler, SubmitErrorHandler, SetValueConfig } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import { redeemACodeSchema } from '@/components/helpers/schemas/FormSchemas';
import { RedeemACodeForm } from '@/components/helpers/interfaces/FormInterfaces';
import { enqueueSnackbarHelper } from '@/components/helpers/UtilHelper';
import { GenericResponseError, GenericSuccessResponse } from '@/components/helpers/ResponseHelpers';

import axios from "axios";
import { useSnackbar } from 'notistack';

const initialValues: RedeemACodeForm = {
    code: '',
    avId: '',

    successMessage: '',
    successful: false,
}

export default function RedeemACodeBody() {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setValueConfig: SetValueConfig = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

    const form = useForm<RedeemACodeForm>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: initialValues,
        resolver: yupResolver(redeemACodeSchema)
    });

    const {
        setValue,
        handleSubmit,
        setError,
        control,
        formState: { isSubmitting },
        watch
    } = form;

    const successMessage = watch('successMessage');
    const successful = watch('successful');

    const onError: SubmitErrorHandler<RedeemACodeForm> = async (formData, e) => {
        console.error(formData);
    }

    const onSubmit: SubmitHandler<RedeemACodeForm> = async (formData, e) => {
        try {
            const { data } = await axios.post<GenericSuccessResponse | GenericResponseError>(
                process.env.CODE_REDEMPTION_REDEEM_A_CODE_ENDPOINT,
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
                            enqueueSnackbarHelper('Error redeeming code', enqueueSnackbar, closeSnackbar);
                            setError('code', { type: 'custom', message: data.message });
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
                            enqueueSnackbarHelper('Error redeeming code', enqueueSnackbar, closeSnackbar);
                            setError('code', { type: 'custom', message: data.message });
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

    return (
        <div>
            <FormProvider {...form} >
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <Grid container spacing={2} columns={12}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card elevation={10}>
                                <CardHeader
                                    titleTypographyProps={{ fontWeight: 'bold', fontSize: 18, textAlign: 'left' }}
                                    title="Redeem a code"
                                    subheader="Please fill out all required fields."
                                    subheaderTypographyProps={{ textAlign: 'left' }}
                                />

                                <Divider color='#1976d2' variant='middle' />

                                <CardContent>
                                    <Grid item container spacing={2} xs={12} sm={12} md={12}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <Controller
                                                control={control}
                                                name='code'
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
                                                        label="Code For Redemption"
                                                        variant="outlined"

                                                        error={!!error}
                                                        helperText={error?.message}
                                                        required={true}
                                                        disabled={successful}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12}>
                                            <Controller
                                                control={control}
                                                name='avId'
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
                                                        label="Avatar ID"
                                                        variant="outlined"

                                                        error={!!error}
                                                        helperText={error?.message}
                                                        required={true}
                                                        disabled={successful}
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
                                                Redeem Code
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
                                                Success!
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12}>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                                {successMessage}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12}>
                                            <Typography sx={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                                                Reward will arrive in mailbox in a few minutes.
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