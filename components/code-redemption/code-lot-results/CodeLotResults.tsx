import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { IncludesLookupResultsForm } from "@/components/helpers/interfaces/FormInterfaces";

import { useFieldArray, useFormContext } from "react-hook-form";

export default function CodeLotDetails() {
    const { control } = useFormContext<IncludesLookupResultsForm>();

    const lookupResults = useFieldArray({
        control,
        name: "lookupResults",
        keyName: 'uniqueId',
    });

    return (
        <div>
            <TableContainer
                component={Paper}
                hidden={(lookupResults.fields.length ? lookupResults.fields.length == 0 : true)}
                sx={{ boxShadow: 10 }}
            >
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ borderBottom: "2px solid black" }}>
                            {lookupResults.fields.find(e => e.code !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Code
                                </TableCell>
                            }

                            {lookupResults.fields.find(e => e.creation !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Creation Date and Time
                                </TableCell>
                            }

                            {lookupResults.fields.find(e => e.manual !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Manual Code?
                                </TableCell>
                            }

                            {lookupResults.fields.find(e => e.rewardCategory !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Reward Category
                                </TableCell>
                            }

                            {lookupResults.fields.find(e => e.rewardItem !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Reward Item
                                </TableCell>
                            }

                            {lookupResults.fields.find(e => e.redeemedAvId !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Redeemed Avatar ID
                                </TableCell>
                            }

                            {lookupResults.fields.find(e => e.redemptions !== undefined) &&
                                <TableCell size='small' align='center'>
                                    Redemptions
                                </TableCell>
                            }
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {lookupResults.fields.map((value, index) => (
                            <TableRow key={value.uniqueId}>
                                {lookupResults.fields.find(e => e.code !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.code}
                                    </TableCell>
                                }

                                {lookupResults.fields.find(e => e.creation !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.creation}
                                    </TableCell>
                                }

                                {lookupResults.fields.find(e => e.manual !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.manual}
                                    </TableCell>
                                }

                                {lookupResults.fields.find(e => e.rewardCategory !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.rewardCategory}
                                    </TableCell>
                                }

                                {lookupResults.fields.find(e => e.rewardItem !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.rewardItem}
                                    </TableCell>
                                }

                                {lookupResults.fields.find(e => e.redeemedAvId !== undefined) &&
                                    <TableCell size='small' align='center'>
                                        {value.redeemedAvId}
                                    </TableCell>
                                }

                                {lookupResults.fields.find(e => e.redemptions !== undefined) &&
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