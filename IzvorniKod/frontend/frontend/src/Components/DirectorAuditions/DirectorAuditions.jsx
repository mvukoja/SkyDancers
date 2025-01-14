import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './DirectorAuditions.css';

const DirectorAuditions = () => {
    const [auditions, setAuditions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuditions = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;

                console.log('Fetching auditions for username:', username);

                const response = await fetch(`http://localhost:8080/audition/getdirectors/${username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Received auditions:', data);
                    setAuditions(Array.isArray(data) ? data : []);
                } else {
                    console.error('Server response not OK:', response.status);
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(`Server responded with status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching auditions:', error);
                setError('Failed to load auditions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAuditions();
    }, []);

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('hr-HR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return dateString || 'N/A';
        }
    };

    if (loading) {
        return (
            <div className="director-auditions">
                <h2>My Auditions</h2>
                <div className="loading">Loading auditions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="director-auditions">
                <h2>My Auditions</h2>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="director-auditions">
            <h2>My Auditions</h2>
            {auditions.length === 0 ? (
                <p className="no-auditions">No auditions found.</p>
            ) : (
                <div className="auditions-list">
                    {auditions.map(audition => (
                        <div key={audition.id} className="audition-card">
                            <div className="audition-header">
                                <h3>Audition #{audition.id}</h3>
                                <span className="subscribed-count">
                                    Subscribed: {audition.subscribed || 0}/{audition.positions}
                                </span>
                            </div>
                            <div className="audition-details">
                                <p><strong>Location:</strong> {audition.location}</p>
                                <p><strong>Date:</strong> {formatDate(audition.datetime)}</p>
                                <p><strong>Deadline:</strong> {formatDate(audition.deadline)}</p>
                                <p><strong>Wage:</strong> {audition.wage}</p>
                                <p><strong>Description:</strong> {audition.description}</p>
                                <div className="styles-list">
                                    <strong>Styles:</strong>
                                    {audition.styles && audition.styles.length > 0 ? (
                                        audition.styles.map((style, index) => (
                                            <span key={index} className="style-tag">{style}</span>
                                        ))
                                    ) : (
                                        <span className="no-styles">No styles specified</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DirectorAuditions;
