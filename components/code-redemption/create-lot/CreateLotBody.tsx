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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useRouter } from "next/router";

import { useForm, FormProvider, Controller, SubmitHandler, SubmitErrorHandler, SetValueConfig, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

import { createLotSchema, ttCodeDict } from '@/components/helpers/schemas/FormSchemas';
import { CreateLotForm, AwardChoices, CreateModes } from '@/components/helpers/interfaces/FormInterfaces';
import { enqueueSnackbarHelper } from '@/components/helpers/UtilHelper';
import { GenericResponseError, GenericResultsSuccessResponse } from '@/components/helpers/ResponseHelpers';
import CodeLotDetails from '@/components/code-redemption/code-lot-results/CodeLotResults';

import axios from "axios";
import { useSnackbar } from 'notistack';

const creationModes: CreateModes[] = [
    {
        mode: 'Manual',
        displayText: 'Manually-created code, many toons use same code',
        disabled: false
    },
    {
        mode: 'Auto',
        displayText: 'Auto-generated codes, one redemption per code',
        disabled: true
    },
]

const initialValues: CreateLotForm = {
    lotName: '',

    codeType: 'Manual',

    numberOfCodes: '',
    confirmNumberOfCodes: '',

    manualCode: '',
    confirmManualCode: '',

    rewardType: '',
    rewardItemId: '',

    hasExpiration: '',
    expiration: '',

    codeLotDetails: [],

    successful: false,
    successMessage: '',
    extraSuccessMessage: '',
}

export default function CreateLotBody({ awardChoices, allowAutoGenerated, maxCodeLength = 16, lotNames }: { awardChoices: AwardChoices[], allowAutoGenerated: boolean, maxCodeLength: number, lotNames: string[] }) {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const setValueConfig: SetValueConfig = { shouldValidate: true, shouldDirty: true, shouldTouch: true };

    creationModes[1].disabled = !allowAutoGenerated;

    const form = useForm<CreateLotForm>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: initialValues,
        resolver: yupResolver(createLotSchema(maxCodeLength))
    });

    const {
        setValue,
        handleSubmit,
        setError,
        control,
        formState: { isSubmitting },
        watch
    } = form;

    const onError: SubmitErrorHandler<CreateLotForm> = async (formData, e) => {
        console.error(formData);
    }

    const onSubmit: SubmitHandler<CreateLotForm> = async (formData, e) => {
        if (lotNames.includes(formData.lotName) || formData.lotName.includes('temp_auto_test_lot_')) {
            setError('lotName', { type: 'custom', message: 'Lot name is already in use!' });
            return;
        }

        if (formData.numberOfCodes != formData.confirmNumberOfCodes) {
            setError('numberOfCodes', { type: 'custom', message: 'Number of codes must match!' });
            setError('confirmNumberOfCodes', { type: 'custom', message: 'Number of codes must match!' });
            return;
        }

        if (formData.manualCode != formData.confirmManualCode) {
            setError('manualCode', { type: 'custom', message: 'Manual Codes must match!' });
            setError('confirmManualCode', { type: 'custom', message: 'Manual Codes must match!' });
            return;
        }

        if (formData.codeType == 'Auto') {
            formData.manualCode = '';
            formData.confirmManualCode = '';
        }

        if (formData.codeType == 'Manual') {
            formData.numberOfCodes = 1;
            formData.confirmNumberOfCodes = 1;

            if (formData.manualCode) {
                for (let char of formData.manualCode) {
                    char = char.toUpperCase();
                    if (!ttCodeDict.isValidManualChar(char)) {
                        setError('manualCode', { type: 'custom', message: 'Code can only contain alphanumeric characters and dashes' });
                        return;
                    }
                }
            }
        }

        try {
            const { data } = await axios.post<GenericResultsSuccessResponse | GenericResponseError>(
                process.env.CODE_REDEMPTION_CREATE_LOT_ENDPOINT,
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
                            enqueueSnackbarHelper('Error creating code lot', enqueueSnackbar, closeSnackbar);
                            setError('lotName', { type: 'custom', message: data.message });
                            return;
                        case 9996:
                            setError('manualCode', { type: 'custom', message: 'Code already exists!' });
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
                            enqueueSnackbarHelper('Error creating code lot', enqueueSnackbar, closeSnackbar);
                            setError('lotName', { type: 'custom', message: data.message });
                            return;
                        case 9996:
                            setError('manualCode', { type: 'custom', message: 'Code already exists!' });
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

    const codeType = watch('codeType');
    const rewardType = watch('rewardType');
    const hasExpiration = watch('hasExpiration');

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
                                    title="Create Lot"
                                    subheader="Please fill out all required fields."
                                    subheaderTypographyProps={{ textAlign: 'left' }}
                                />

                                <Divider color='#1976d2' variant='middle' />

                                <CardContent>
                                    <Grid item container spacing={2} xs={12} sm={12} md={12}>
                                        <Grid item xs={12} sm={12} md={6}>
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

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6}>
                                            <Controller
                                                control={control}
                                                name='codeType'
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <TextField
                                                        name={field.name}
                                                        value={field.value}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            field.onChange(event, event.target.value);
                                                            setValue('rewardType', '', setValueConfig);
                                                            setValue('rewardItemId', '', setValueConfig);
                                                        }}
                                                        inputRef={field.ref}
                                                        onBlur={field.onBlur}

                                                        fullWidth
                                                        label="Code Type"
                                                        variant="outlined"
                                                        required

                                                        select
                                                        SelectProps={{ MenuProps: { autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true, disableAutoFocus: true, } }}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    >
                                                        <MenuItem disabled value="" hidden>
                                                            <em>Code Type</em>
                                                        </MenuItem>

                                                        {creationModes.map((option) => (
                                                            <MenuItem
                                                                value={option.mode}
                                                                key={option.mode}
                                                                disabled={option.disabled}>
                                                                {option.displayText}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6} hidden={(!(codeType == 'Auto'))}>
                                            <Controller
                                                control={control}
                                                name='numberOfCodes'
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
                                                        label="Number of Codes"
                                                        variant="outlined"
                                                        required={codeType == 'Auto'}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6} hidden={(!(codeType == 'Auto'))}>
                                            <Controller
                                                control={control}
                                                name='confirmNumberOfCodes'
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
                                                        label="Confirm Number of Codes"
                                                        variant="outlined"
                                                        required={codeType == 'Auto'}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6} hidden={(!(codeType == 'Manual'))}>
                                            <Controller
                                                control={control}
                                                name='manualCode'
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
                                                        label="Manual Code"
                                                        variant="outlined"
                                                        required={codeType == 'Manual'}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6} hidden={(!(codeType == 'Manual'))}>
                                            <Controller
                                                control={control}
                                                name='confirmManualCode'
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
                                                        label="Confirm Manual Code"
                                                        variant="outlined"
                                                        required={codeType == 'Manual'}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6}>
                                            <Controller
                                                control={control}
                                                name='rewardType'
                                                render={({
                                                    field,
                                                    fieldState: { error },
                                                }) => (
                                                    <TextField
                                                        name={field.name}
                                                        value={field.value}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            field.onChange(event, event.target.value);
                                                            setValue('rewardItemId', '', setValueConfig);
                                                        }}
                                                        inputRef={field.ref}
                                                        onBlur={field.onBlur}

                                                        fullWidth
                                                        label="Reward Type"
                                                        variant="outlined"
                                                        required

                                                        select
                                                        SelectProps={{ MenuProps: { autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true, disableAutoFocus: true, } }}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    >
                                                        <MenuItem disabled value="" hidden>
                                                            <em>Reward Type</em>
                                                        </MenuItem>

                                                        {awardChoices.map((option) => (
                                                            <MenuItem
                                                                value={option.rewardType}
                                                                key={option.rewardType}
                                                                hidden={(option.manualReward && codeType == 'Manual')}>
                                                                {option.rewardName}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6}>
                                            <Controller
                                                control={control}
                                                name='rewardItemId'
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
                                                        label="Reward Item"
                                                        variant="outlined"
                                                        required

                                                        select
                                                        SelectProps={{ MenuProps: { autoFocus: false, disableAutoFocusItem: true, disableEnforceFocus: true, disableAutoFocus: true, } }}

                                                        error={!!error}
                                                        helperText={error?.message}
                                                    >
                                                        <MenuItem disabled value="" hidden>
                                                            <em>Award Type</em>
                                                        </MenuItem>

                                                        {awardChoices.find(item => item.rewardType == rewardType)?.rewards.map((option) => (
                                                            <MenuItem
                                                                value={option.itemId}
                                                                key={option.description}>
                                                                {option.description}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={12}>
                                            <FormLabel>
                                                Has expiration date?
                                            </FormLabel>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6}>
                                            <Controller
                                                control={control}
                                                name="hasExpiration"
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
                                                                value={"Yes"}
                                                                control={<Radio disabled={isSubmitting || successful} />}
                                                                label="Yes"
                                                                disabled={isSubmitting || successful} />

                                                            <FormControlLabel
                                                                value={"No"}
                                                                control={<Radio disabled={isSubmitting || successful} />}
                                                                label="No"
                                                                disabled={isSubmitting || successful} />
                                                        </RadioGroup>
                                                    </div>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6} hidden={!(hasExpiration == 'Yes')}>
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
                                                                required: (hasExpiration == 'Yes'),
                                                                fullWidth: true,
                                                                error: !!error
                                                            }
                                                        }}
                                                        inputRef={field.ref}
                                                        label="Expiration Date"
                                                        disablePast
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
                                                Create Lot
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
        </div >
    )
}