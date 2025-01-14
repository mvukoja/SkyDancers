import React, { useState } from 'react';
import './SearchAuditions.css';

const SearchAuditions = () => {
    const [searchCriteria, setSearchCriteria] = useState({
        datetime: '',
        wage: '',
        location: '',
        styles: []
    });
    const [auditions, setAuditions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const danceStyles = [
        "Balet", "Tango", "Breakdance", "Jazz", "Valcer"
    ];

    const handleStyleChange = (style) => {
        setSearchCriteria(prev => {
            const currentStyles = prev.styles || [];
            if (currentStyles.includes(style)) {
                return {
                    ...prev,
                    styles: currentStyles.filter(s => s !== style)
                };
            } else {
                return {
                    ...prev,
                    styles: [...currentStyles, style]
                };
            }
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const searchPayload = {
                ...searchCriteria,
                datetime: searchCriteria.datetime || null,
                wage: searchCriteria.wage ? parseInt(searchCriteria.wage) : null
            };

            console.log('Search payload:', searchPayload);

            const response = await fetch('http://localhost:8080/audition/searchauditions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchPayload)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Search results:', data);
                setAuditions(Array.isArray(data) ? data : []);
            } else {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error('Failed to search auditions');
            }
        } catch (error) {
            console.error('Error searching auditions:', error);
            setError('Failed to search auditions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="search-auditions">
            <h2>Search Auditions</h2>
            
            <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={searchCriteria.datetime}
                        onChange={(e) => setSearchCriteria(prev => ({
                            ...prev,
                            datetime: e.target.value
                        }))}
                    />
                </div>

                <div className="form-group">
                    <label>Minimum Wage:</label>
                    <input
                        type="number"
                        value={searchCriteria.wage}
                        onChange={(e) => setSearchCriteria(prev => ({
                            ...prev,
                            wage: e.target.value
                        }))}
                        placeholder="Enter minimum wage"
                    />
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        value={searchCriteria.location}
                        onChange={(e) => setSearchCriteria(prev => ({
                            ...prev,
                            location: e.target.value
                        }))}
                        placeholder="Enter location"
                    />
                </div>

                <div className="form-group">
                    <label>Dance Styles:</label>
                    <div className="styles-checkboxes">
                        {danceStyles.map(style => (
                            <label key={style} className="style-checkbox">
                                <input
                                    type="checkbox"
                                    checked={searchCriteria.styles.includes(style)}
                                    onChange={() => handleStyleChange(style)}
                                />
                                {style}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            <div className="auditions-results">
                {auditions.length > 0 ? (
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
                ) : (
                    <p className="no-results">No auditions found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default SearchAuditions;
