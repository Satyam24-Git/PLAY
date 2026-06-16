from setuptools import setup, find_packages
setup(
    name='shared-core', 
    version='0.1', 
    packages=find_packages(),
    install_requires=[
        'supabase>=2.3.0',
        'python-dotenv>=1.0.0'
    ]
)
