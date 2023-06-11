import Box from '@mui/material/Box';

import PageHeader from '@/components/PageHeader/PageHeader';
import RedeemACodeBody from '@/components/code-redemption/redeem-a-code/RedeemACodeBody';

import sharedStyles from '@/styles/shared.module.scss';

export default function RedeemCode() {

    return (
        <div className={sharedStyles.container}>
            <Box className={sharedStyles.formPage}>
                <PageHeader
                    headerTitle='Code Redemption'
                    subTitle='Redeem a Code'
                />

                <RedeemACodeBody />
            </Box>
        </div>
    )
}