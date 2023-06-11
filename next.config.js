/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    swcMinify: true,

    env: {
        'CODE_REDEMPTION_MAIN_MENU': '/code-redemption',

        'CODE_REDEMPTION_CREATE_LOT': '/code-redemption/create-lot',
        'CODE_REDEMPTION_CREATE_LOT_ENDPOINT': '/api/code-redemption/create-lot',

        'CODE_REDEMPTION_VIEW_LOT': '/code-redemption/view-lot',
        'CODE_REDEMPTION_VIEW_LOT_ENDPOINT': '/api/code-redemption/view-lot',

        'CODE_REDEMPTION_MODIFY_LOT': '/code-redemption/modify-lot',
        'CODE_REDEMPTION_MODIFY_LOT_ENDPOINT': '/api/code-redemption/modify-lot',

        'CODE_REDEMPTION_DELETE_LOT': '/code-redemption/delete-lot',
        'CODE_REDEMPTION_DELETE_LOT_ENDPOINT': '/api/code-redemption/delete-lot',

        'CODE_REDEMPTION_LOOKUP_CODES': '/code-redemption/lookup-codes',
        'CODE_REDEMPTION_LOOKUP_CODES_ENDPOINT': '/api/code-redemption/lookup-codes',

        'CODE_REDEMPTION_REDEEM_A_CODE': '/code-redemption/redeem-a-code',
        'CODE_REDEMPTION_REDEEM_A_CODE_ENDPOINT': '/api/code-redemption/redeem-a-code',

        'CODE_REDEMPTION_UNAVAILABLE': '/code-redemption/unavailable',
    },

    output: 'standalone',
}
