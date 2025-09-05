import React from 'react';
import typrScreenshot from '../../../assets/pictures/typr_screenshot.png';
import wilyuhmScreenshot from '../../../assets/pictures/wilyuhm_screenshot.png';
export interface SoftwareProjectsProps {}

const SoftwareProjects: React.FC<SoftwareProjectsProps> = () => {
    return (
        <div className="site-page-content">
            <h1>Software</h1>
            <h3>Projects</h3>
            <br />
            <p>
                Below are some of my favorite software projects I have worked on
                over the last few years.
            </p>
            <br />
            <br />
            <div className="text-block">
                <h2>typr</h2>
                <br />
                <p>
                    typr is a command line typing speed test built to help developers
                    improve their typing speed and accuracy directly from the terminal.
                    Available as a Homebrew formula for easy installation.
                </p>
                <br />
                <img src={typrScreenshot} alt="typr command line typing test screenshot" style={{maxWidth: '100%', height: 'auto'}} />
                <br />
                <br />
                <h3>Links:</h3>
                <a href="https://github.com/willyamjarcand/homebrew-typr">GitHub Repository</a>
            </div>
            <br />
            <div className="text-block">
                <h2>wilyuhm.dev</h2>
                <br />
                <p>
                    wilyuhm.dev is my portfolio website, and also the
                    website you are on right now. 
                </p>
                <br />
                <img src={wilyuhmScreenshot} alt="wilyuhm.dev portfolio website screenshot" style={{maxWidth: '100%', height: 'auto'}} />
                <br />
                <br />
                <h3>Links:</h3>
                <a href="https://wilyuhm.dev">Wilyuhm.dev</a>
            </div>
        </div>
    );
};

export default SoftwareProjects;
