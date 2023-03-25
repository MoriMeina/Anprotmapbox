import React, {useState} from 'react';
import {Document, Page} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/cjs/Page/TextLayer.css';

const PDFShower = (props) => {
    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null);

    const pdfUrl = props.pdfUrl;
    console.log('pdfUrl:', pdfUrl)

    return (
        <div>
            {pdfUrl ? (
                <Document
                    file={pdfUrl}
                    onLoadSuccess={({numPages}) => {
                        setNumPages(numPages);
                    }}
                    onLoadError={(error) => {
                        setError(error);
                    }}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            onLoadError={(error) => console.error('Error while loading page:', error)}
                        />
                    ))}
                </Document>
            ) : (
                <div>Loading PDF...</div>
            )}
            {error && <div>Error while loading PDF: {error.message}</div>}
        </div>
    );
};

export default PDFShower;
