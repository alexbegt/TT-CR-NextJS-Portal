import Button from "@mui/material/Button";

import { Fragment } from 'react';

export const enqueueSnackbarHelper = (msg: string, enqueueSnackbar: any, closeSnackbar: any) => {
    enqueueSnackbar(msg, {
        variant: 'error',
        autoHideDuration: 2500,
        disableWindowBlurListener: true,
        action: (key: any) => (
            <Fragment>
                <Button
                    variant="contained"
                    color="primary"
                    size='small'
                    onClick={() => closeSnackbar(key)}
                >
                    Dismiss
                </Button>
            </Fragment>
        )
    });
}