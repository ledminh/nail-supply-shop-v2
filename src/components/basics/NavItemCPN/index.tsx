import styles from './NavItemCPN.module.scss';

export interface Props {
    label: string;
};

export default function NavigationItemCPN({
    label
}: Props) {
    return (
        <span className={styles.item}>
            {label}
        </span>
    );
}