import styles from "@styles/layouts/TableLayout.module.scss";

type HeaderCellData = {
  key: string;
  value: string;
};

type HeaderData = {
  key: string;
  cells: HeaderCellData[];
};

type CellData = {
  key: string;
  value: string;
};

type RowData = {
  key: string;
  cells: CellData[];
};

type FooterData = {
  key: string;
  cells: CellData[];
};

export interface Props {
  header?: HeaderData;
  rows: RowData[];
  footer: FooterData;

  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
}

export default function TableLayout({
  header,
  rows,
  footer,
  tableClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  rowClassName,
  cellClassName,
}: Props) {
  const tableClass = [styles.table, tableClassName].join(" ");
  const headerClass = [styles.header, headerClassName].join(" ");
  const bodyClass = [styles.body, bodyClassName].join(" ");
  const footerClass = [styles.footer, footerClassName].join(" ");
  const rowClass = [styles.row, rowClassName].join(" ");
  const cellClass = [styles.cell, cellClassName].join(" ");

  return (
    <div className={tableClass}>
      {header && (
        <div className={headerClass}>
          {header.cells.map((h) => (
            <div key={h.key} className={cellClass}>
              {h.value}
            </div>
          ))}
        </div>
      )}
      <div className={bodyClass}>
        {rows.map((row, index) => (
          <div key={row.key} className={rowClass}>
            {row.cells.map((cell, index) => (
              <div key={cell.key} className={cellClass}>
                {cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={footerClass}>
        {footer.cells.map((cell) => (
          <div key={cell.key} className={cellClass}>
            {cell.value}
          </div>
        ))}
      </div>
    </div>
  );
}
