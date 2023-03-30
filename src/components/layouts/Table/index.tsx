import styles from '@styles/layouts/TableLayout.module.scss';

export interface Props {
    header: {
        key: string;
        label: string;
    }[];
    rows: string[][];
    footer: string[];

    tableClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
}

export default function TableLayout({header, rows, footer, tableClassName, headerClassName, bodyClassName, footerClassName, rowClassName, cellClassName}: Props) {

    const tableClass = [styles.table, tableClassName].join(' ');
    const headerClass = [styles.header, headerClassName].join(' ');
    const bodyClass = [styles.body, bodyClassName].join(' ');
    const footerClass = [styles.footer, footerClassName].join(' ');
    const rowClass = [styles.row, rowClassName].join(' ');
    const cellClass = [styles.cell, cellClassName].join(' ');


    return (
        <div className={tableClass}>
            <div className={headerClass}>
                {header.map((h) => (
                    <div key={h.key} className={cellClass}>
                        {h.label}
                    </div>
                ))}
            </div>
            <div className={bodyClass}>
                {rows.map((row, index) => (
                    <div key={index} className={rowClass}>
                        {
                            row.map((cell, index) => (
                                <div key={index} className={cellClass}>
                                    {cell}
                                </div>
                            ))
                        }
                    </div>
                ))}
            </div>
            <div className={footerClass}>
                {footer.map((cell, index) => (
                    <div key={index} className={cellClass}>
                        {cell}
                    </div>
                ))}
            </div>
        </div>
    );
}