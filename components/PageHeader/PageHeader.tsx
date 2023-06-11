//Import React for as it is required
import { FC } from 'react';

import Head from 'next/head';

import styles from '@/styles/PageHeader.module.scss';

export declare type PageHeaderProps = {
    headerTitle: string,
    subTitle?: string,
}

const PageHeader: FC<PageHeaderProps> = ({ headerTitle, subTitle }: PageHeaderProps) => {
    let title = 'Code Redemption'

    if (subTitle) {
        title = `${title}: ${subTitle}`
    }

    return (
        <div className={styles.headerContainer}>
            <Head>
                <title>{title}</title>
                <meta name="description" content={headerTitle} />
                <link rel="icon" href="/icon.ico" />
            </Head>

            <main className={styles.mainHeader}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        {headerTitle}
                    </h1>
                </header>
            </main>
        </div >
    );
}

export default PageHeader;