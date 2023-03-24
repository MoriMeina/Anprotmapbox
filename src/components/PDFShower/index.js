// import React, { useState } from 'react';
// import axios from 'axios';
// import { Document, Page } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import { pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
//
// const PDFShower = (props) => {
//     const [pdfUrl, setPdfUrl] = useState(null);
//     const [numPages, setNumPages] = useState(null);
//     const [value,setValue]=useState(null);
//     setValue(props.value);
//     const showPDF = async () => {
//         console.log('download_file:', value);
//         const response = await axios.get(`http://localhost:5000/pdf/${value}`, {
//             responseType: 'blob',
//         });
//         const file = new Blob([response.data], { type: 'application/pdf' });
//         const fileUrl = URL.createObjectURL(file);
//         setPdfUrl(fileUrl);
//     };
//
//     return (
//             <Document
//                 file={pdfUrl}
//                 onLoadSuccess={({ numPages }) => {
//                     setNumPages(numPages);
//                 }}
//                 error={(error) => console.error('Error while loading PDF:', error)}
//             >
//                 {Array.from(new Array(numPages), (el, index) => (
//                     <Page
//                         key={`page_${index + 1}`}
//                         pageNumber={index + 1}
//                         onLoadError={(error) => console.error('Error while loading page:', error)}
//                     />
//                 ))}
//             </Document>
//
//     );
// };
//
// export default PDFShower;
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const PDFShower = (props) => {
    const [numPages, setNumPages] = useState(null);
    const [error, setError] = useState(null);

    const pdfUrl = props.pdfUrl;
    console.log('pdfUrl:',pdfUrl)

    return (
        <div>
            {pdfUrl ? (
                <Document
                    file={pdfUrl}
                    onLoadSuccess={({ numPages }) => {
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
