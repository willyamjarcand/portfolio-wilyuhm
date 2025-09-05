import React from 'react';
import ResumeDownload from './ResumeDownload';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = () => {
    return (
        <div className="site-page-content">
            <ResumeDownload />
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Wealthsimple</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://www.wealthsimple.com'}
                        >
                            <h4>www.wealthsimple.com</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Software Developer II</h3>
                        <b>
                            <p></p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Software Developer II, Wealthsimple (May 2025 - Present)
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Building scalable fintech solutions to democratize access to financial services.
                        </p>
                    </li>
                    <li>
                        <p>
                            Developing front-end applications using React and back-end services with Ruby on Rails.
                        </p>
                    </li>
                </ul>
            </div>

            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Shopify</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://www.shopify.com'}
                        >
                            <h4>www.shopify.com</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Software Engineer</h3>
                        <b>
                            <p></p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Software Engineer, Shopify - Merchant Services, Shipping (June 2022 - May 2025)
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Resolved critical Ruby on Rails issues during on-call duties, enhancing system stability.
                        </p>
                    </li>
                    <li>
                        <p>
                            Drove merchant success by designing,
                            engineering, and integrating partner APIs for
                            important feature implementation.
                        </p>
                    </li>
                    <li>
                        <p>
                            Bolstered data security for merchants by
                            developing and shipping authenticated GraphQL
                            APIs.
                        </p>
                    </li>
                    <li>
                        <p>
                            Fueled development and maintenance of key
                            software components using JavaScript,
                            TypeScript, React, GraphQL, Ruby on Rails, and
                            REST APIs.                    
                        </p>
                    </li>
                    <li>
                        <p>
                            Boosted product adoption by 3% through the
                            successful delivery of a key 'Bring your own
                            account' feature for merchants.                        
                        </p>
                    </li>
                </ul>
            </div>

            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>Coveo</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://www.coveo.com/en'}
                        >
                            <h4>www.coveo.com</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>System Administrator intern</h3>
                        <b>
                            <p></p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Internal tooling dev, Coveo - System Administrators (June 2021 - December 2021)
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Optimized sys admin workflows by developing efficient tools and scripts.
                        </p>
                    </li>
                    <li>
                        <p>
                            Employed a diverse tech stack including Bash, C#, Python, Jenkins, Flask, REST API, ServiceNow, Kubernetes, and Dockers to drive project success.
                        </p>
                    </li>
                    <li>
                        <p>
                            Demonstrated strong work ethic and
                            commitment by extending role beyond initial
                            internship to part-time employment.
                        </p>
                    </li>
                </ul>
            </div>
            <div style={styles.headerContainer}>
                <div style={styles.header}>
                    <div style={styles.headerRow}>
                        <h1>College FXG</h1>
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href={'https://www.cegepgarneau.ca/cegep/welcome'}
                        >
                            <h4>www.cegepgarneau.ca/cegep/welcome</h4>
                        </a>
                    </div>
                    <div style={styles.headerRow}>
                        <h3>Tutor</h3>
                        <b>
                            <p></p>
                        </b>
                    </div>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Tutor for computer science classes (January 2020 - December 2021)
                </p>
                <br />
                <ul>
                    <li>
                        <p>
                            Enhanced student understanding in computer
                            science and math through adaptive one-on-one
                            tutoring and mentoring, demonstrating effective
                            communication and pedagogical flexibility.
                        </p>
                    </li>
                </ul>
            </div>
            <ResumeDownload />
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
    },
    skillRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    skillName: {
        minWidth: 56,
    },
    skill: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        background: 'red',
        marginLeft: 8,
        height: 8,
    },
    hoverLogo: {
        height: 32,
        marginBottom: 16,
    },
    headerContainer: {
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'center',
    },
    hoverText: {
        marginBottom: 8,
    },
    indent: {
        marginLeft: 24,
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default Experience;
