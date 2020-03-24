import React from 'react';
import DataGrid, { Scrolling, Column } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import shortNum from 'short-number';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(4),
      width: '100%',
      height: '100%'
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    gridContainer: {
        height: 600
    }
  }),
);

interface Props {
    columns: string[];
    data: {[key: string]: number | string}[]
}

const renderGridCell = (data) => {
    if(data.data.isShutdown) {
        data.cellElement.bgColor = '#ffcccb';
    }

    return data.text;
}

export const Table: React.FC<Props> = ({ columns, data }) => {
    const classes = useStyles();

    const customizeCellValue = (cellInfo) => {
        if(typeof cellInfo.value === 'number') {
            return shortNum(cellInfo.value) + '';
        }

        return cellInfo.value + '';
    }

    return <Paper elevation={3} className={classes.root}>
        <DataGrid
            elementAttr={{
                class: classes.gridContainer
            }}
            allowColumnReordering={true}
            allowColumnResizing={true}
            showRowLines={true}
            // @ts-ignore
            dataSource={data}
            showBorders={true}>
            {columns.map(c => <Column 
                dataField={c}
                cellRender={renderGridCell}
                customizeText={customizeCellValue}/>)}
            <Scrolling mode="virtual" />
        </DataGrid>
    </Paper>
}
