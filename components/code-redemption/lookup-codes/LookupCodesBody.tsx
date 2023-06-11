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

import { lookupSchema } from '@/components/helpers/schemas/FormSchemas';
import { LookupForm, LookupModes } from '@/components/helpers/interfaces/FormInterfaces';
import { enqueueSnackbarHelper } from '@/components/helpers/UtilHelper';
import { GenericResponseError, GenericResultsSuccessResponse } from '@/components/helpers/ResponseHelpers';
import CodeLotDetails from '@/components/code-redemption/code-lot-results/CodeLotResults';

import axios from "axios";
import { useSnackbar } from 'notistack';

const modes: LookupModes[] = [
    {
        mode: 'Code',
        displayText: 'Code'
    },
    {
        mode: 'AvId',
        displayText: 'Redeemer AvId'
    }
]

const initialValues: LookupForm = {
    mode: '',

    code: '',
    avId: '',

    successMessage: '',
    successful: false,
    lookupResults: [],
}

export default function LookupBody() {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setValueConfig: SetValueConfig = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

    const form = useForm<LookupForm>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: initialValues,
        resolver: yupResolver(lookupSchema)
    });

    const {
        setValue,
        handleSubmit,
        setError,
        control,
        formState: { isSubmitting },
        watch
    } = form;

    const onError: SubmitErrorHandler<LookupForm> = async (formData, e) => {
        console.error(formData);
    }

    const onSubmit: SubmitHandler<LookupForm> = async (formData, e) => {
        try {
            const { data } = await axios.post<GenericResultsSuccessResponse | GenericResponseError>(
                process.env.CODE_REDEMPTION_LOOKUP_CODES_ENDPOINT,
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
                            enqueueSnackbarHelper('Error Looking Up', enqueueSnackbar, closeSnackbar);
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
                setValue('lookupResults', data.results, setValueConfig);
            }

            return;
        } catch (error: any) {
            if (error.response) {
                const { data } = error.response;

                if (data.message) {
                    switch (data.errorCode) {
                        case 9997:
                        case 9998:
                            enqueueSnackbarHelper('Error looking up ', enqueueSnackbar, closeSnackbar);
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

    const mode = watch('mode');
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
                                    title="Look up existing codes"
                                    subheader="Please fill out all required fields."
                                    subheaderTypographyProps={{ textAlign: 'left' }}
                                />

                                <Divider color='#1976d2' variant='middle' />

                                <CardContent>
                                    <Grid item container spacing={2} xs={12} sm={12} md={12}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <Controller
                                                control={control}
                                                name='mode'
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
                                                        label="Lookup by"
                                                        variant="outlined"

                                                        select
                                                        SelectProps={{ MenuProps: { autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true, disableAutoFocus: true, } }}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                        required={true}
                                                        disabled={successful}
                                                    >
                                                        <MenuItem disabled value="" hidden>
                                                            <em>Select Size</em>
                                                        </MenuItem>

                                                        {modes.map((option) => (
                                                            <MenuItem
                                                                value={option.mode}
                                                                key={option.mode}>
                                                                {option.displayText}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12} hidden={!(mode == 'Code')}>
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
                                                        label="Code"
                                                        variant="outlined"

                                                        error={!!error}
                                                        helperText={error?.message}
                                                        required={(mode == 'Code')}
                                                        disabled={successful}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12} hidden={!(mode == 'AvId')}>
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
                                                        label="Redeemer Avatar ID"
                                                        variant="outlined"

                                                        error={!!error}
                                                        helperText={error?.message}
                                                        required={(mode == 'AvId')}
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
                                                Look Up Code
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