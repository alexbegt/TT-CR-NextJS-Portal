import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { useRouter } from "next/router";

import { useForm, FormProvider, Controller, SubmitHandler, SubmitErrorHandler, SetValueConfig, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import { viewLotSchema } from '@/components/helpers/schemas/FormSchemas';
import { ViewLotForm } from '@/components/helpers/interfaces/FormInterfaces';
import { enqueueSnackbarHelper } from '@/components/helpers/UtilHelper';
import { GenericResponseError, ViewLotSuccessResponse } from '@/components/helpers/ResponseHelpers';
import CodeLotDetails from '@/components/code-redemption/code-lot-results/CodeLotResults';

import axios from "axios";
import { useSnackbar } from 'notistack';

const filterOptions: string[] = [
    'All Codes',
    'Redeemable Codes',
    'Non-Redeemable Codes',
    'Redeemed Codes',
    'Expired Codes'
]

const initialValues: ViewLotForm = {
    codeLot: '',
    filterOption: 'All Codes',
    justCode: true,

    successMessage: '',
    successful: false,
    lookupResults: [],
}

export default function ViewLotBody({ lots }: { lots: string[] }) {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setValueConfig: SetValueConfig = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

    const form = useForm<ViewLotForm>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: initialValues,
        resolver: yupResolver(viewLotSchema)
    });

    const {
        setValue,
        handleSubmit,
        setError,
        control,
        formState: { isSubmitting },
        watch
    } = form;

    const onError: SubmitErrorHandler<ViewLotForm> = async (formData, e) => {
        console.error(formData);
    }

    const onSubmit: SubmitHandler<ViewLotForm> = async (formData, e) => {
        try {
            const { data } = await axios.post<ViewLotSuccessResponse | GenericResponseError>(
                process.env.CODE_REDEMPTION_VIEW_LOT_ENDPOINT,
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
                            enqueueSnackbarHelper('Error viewing code lot details', enqueueSnackbar, closeSnackbar);
                            setError('codeLot', { type: 'custom', message: data.message });
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
                setValue('lookupResults', data.lookupResults, setValueConfig);
            }

            return;
        } catch (error: any) {
            if (error.response) {
                const { data } = error.response;

                if (data.message) {
                    switch (data.errorCode) {
                        case 9997:
                        case 9998:
                            enqueueSnackbarHelper('Error viewing code lot details', enqueueSnackbar, closeSnackbar);
                            setError('codeLot', { type: 'custom', message: data.message });
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
                                    title="View Lot"
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
                                                name='filterOption'
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
                                                        label="Filter by"
                                                        variant="outlined"
                                                        required

                                                        select
                                                        SelectProps={{ MenuProps: { autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true, disableAutoFocus: true, } }}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    >
                                                        <MenuItem disabled value="" hidden>
                                                            <em>Filter by</em>
                                                        </MenuItem>

                                                        {filterOptions.map((option) => (
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
                                            <FormLabel>
                                                Filter Options?
                                            </FormLabel>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6}>
                                            <Controller
                                                control={control}
                                                name="justCode"
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <div>
                                                        <FormHelperText error hidden={!error}>
                                                            {error?.message}
                                                        </FormHelperText>

                                                        <RadioGroup
                                                            name={field.name}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                        >
                                                            <FormControlLabel
                                                                inputRef={field.ref}
                                                                value={true}
                                                                control={<Radio disabled={isSubmitting || successful} />}
                                                                label="Code Only"
                                                                disabled={isSubmitting || successful} />

                                                            <FormControlLabel
                                                                value={false}
                                                                control={<Radio disabled={isSubmitting || successful} />}
                                                                label="All Fields"
                                                                disabled={isSubmitting || successful} />
                                                        </RadioGroup>
                                                    </div>
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
                                                View Lot
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