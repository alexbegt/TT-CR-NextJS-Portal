import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { IncludesCodeLotDetailsResponse } from "@/components/helpers/interfaces/FormInterfaces";

import { useFieldArray, useFormContext } from "react-hook-form";

export default function CodeLotDetails() {
    const { control } = useFormContext<IncludesCodeLotDetailsResponse>();

    const codeLotDetails = useFieldArray({
        control,
        name: "codeLotDetails",
        keyName: 'uniqueId',
    });

    return (
        <div>
            <TableContainer
                component={Paper}
                hidden={(codeLotDetails.fields.length ? codeLotDetails.fields.length == 0 : true)}
                sx={{ boxShadow: 10 }}
            >
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ borderBottom: "2px solid black" }}>
                            {codeLotDetails.fields.find(e => e.code !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Code
                                </TableCell>
                            }

                            {codeLotDetails.fields.find(e => e.creation !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Creation Date and Time
                                </TableCell>
                            }

                            {codeLotDetails.fields.find(e => e.expiration !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Expiration Date and Time
                                </TableCell>
                            }

                            {codeLotDetails.fields.find(e => e.manual !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Manual Code?
                                </TableCell>
                            }

                            {codeLotDetails.fields.find(e => e.rewardCategory !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Reward Category
                                </TableCell>
                            }

                            {codeLotDetails.fields.find(e => e.rewardItem !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Reward Item
                                </TableCell>
                            }

                            {codeLotDetails.fields.find(e => e.redeemedAvId !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Redeemed Avatar ID
                                </TableCell>
                            }

                            {codeLotDetails.fields.find(e => e.redemptions !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Redemptions
                                </TableCell>
                            }
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {codeLotDetails.fields.map((value, index) => (
                            <TableRow key={value.uniqueId}>
                                {codeLotDetails.fields.find(e => e.code !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.code}
                                    </TableCell>
                                }

                                {codeLotDetails.fields.find(e => e.creation !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.creation}
                                    </TableCell>
                                }

                                {codeLotDetails.fields.find(e => e.expiration !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.expiration}
                                    </TableCell>
                                }

                                {codeLotDetails.fields.find(e => e.manual !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.manual}
                                    </TableCell>
                                }

                                {codeLotDetails.fields.find(e => e.rewardCategory !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.rewardCategory}
                                    </TableCell>
                                }

                                {codeLotDetails.fields.find(e => e.rewardItem !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.rewardItem}
                                    </TableCell>
                                }

                                {codeLotDetails.fields.find(e => e.redeemedAvId !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.redeemedAvId}
                                    </TableCell>
                                }

                                {codeLotDetails.fields.find(e => e.redemptions !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.redemptions}
                                    </TableCell>
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}