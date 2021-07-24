import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    fab: {
        margin: theme.spacing(2),
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
}));

export default function SimpleTooltips() {
    const classes = useStyles();

    return (
        <div>
            <Tooltip title="Delete">
                <div>
                    PB01
                </div>
            </Tooltip>
            <Tooltip title="Add" aria-label="add">
                <div>
                    PB02
                </div>
            </Tooltip>
            <Tooltip title="Add" aria-label="add">
                <div>
                    PB03
                </div>
            </Tooltip>
        </div>
    );
}